import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { type Observable, type Subscription, catchError, map, of, switchMap, take, timer } from 'rxjs'
import { getLocation } from 'src/app/shared/utils/location'
import { formatTime } from 'src/app/shared/utils/timer'
import { passwordMatchValidator, validateByTrimming } from 'src/app/shared/utils/custom-validators'
import { GeoLocationRepo } from 'src/app/shared/repos/geo-location.repo'
import { MAX_OTP_LIMIT, OTP_RESEND_MAX_TIME, OTP_TIMER, passwordMinLength, userNameMaxLength, userNameMinLength } from 'src/app/core/constants/constants'
import { emailValidators, nameValidators, otpValidators, passwordValidators, requiredValidator, zipValidators } from 'src/app/shared/utils/form-validators'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

type Step = 'details' | 'verify'
interface Coords { lat: number, lon: number }

/** Theater sign-up in two steps: theater details, then the 4-digit code the backend emails. Approval follows. */
@Component({
  selector: 'app-thr-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, ButtonDirective, FieldErrorComponent]
})
export class TheaterRegisterComponent {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly geo = inject(GeoLocationRepo)

  protected readonly step = signal<Step>('details')
  /** Where the code was sent, shown on the code step */
  protected readonly sentTo = signal('')
  protected readonly busy = signal(false)
  protected readonly showPassword = signal(false)

  // Step 1: details -------------------------------------------------------------

  protected readonly details = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [validateByTrimming(nameValidators)] }),
    email: new FormControl('', { nonNullable: true, validators: [validateByTrimming(emailValidators)] }),
    liscenceId: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    landmark: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    district: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    state: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    country: new FormControl('India', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    zip: new FormControl('', { nonNullable: true, validators: [validateByTrimming(zipValidators)] }),
    password: new FormControl('', { nonNullable: true, validators: [validateByTrimming(passwordValidators)] }),
    repeatPassword: new FormControl('', { nonNullable: true })
  }, { validators: passwordMatchValidator })

  protected readonly detailsSubmitted = signal(false)

  protected readonly messages = {
    name: {
      required: 'Enter the theater name',
      minlength: `Use at least ${userNameMinLength} letters`,
      maxlength: `Use at most ${userNameMaxLength} letters`,
      pattern: 'Use letters and spaces only'
    },
    email: { required: 'Enter your business email', pattern: 'Enter a valid email address' },
    liscenceId: { required: 'Enter your theater licence number' },
    city: { required: 'Enter the city' },
    district: { required: 'Enter the district' },
    state: { required: 'Enter the state' },
    country: { required: 'Enter the country' },
    zip: { required: 'Enter the PIN code', pattern: 'PIN codes are 6 digits' },
    password: {
      required: 'Choose a password',
      minlength: `Use at least ${passwordMinLength} characters`,
      pattern: 'Include an uppercase letter, a lowercase letter and a number'
    },
    repeatPassword: { required: 'Type the password again', passwordMismatch: "The passwords don't match" },
    otp: { required: 'Enter the 4-digit code', pattern: 'The code is 4 digits' }
  }

  // Where the theater is: from the browser, or looked up from the typed address when sending
  private readonly coords = signal<Coords | null>(null)
  protected readonly locating = signal(false)
  protected readonly locationNote = signal<{ tone: 'success' | 'danger', text: string } | null>(null)

  // Step 2: email code -------------------------------------------------------------

  protected readonly otp = new FormControl('', { nonNullable: true, validators: [validateByTrimming(otpValidators)] })
  protected readonly otpSubmitted = signal(false)
  protected readonly secondsLeft = signal(0)
  protected readonly countdown = computed(() => formatTime(this.secondsLeft()))
  protected readonly expired = computed(() => this.step() === 'verify' && this.secondsLeft() === 0)
  protected readonly resendsUsed = signal(0)
  protected readonly resendWindowOpen = signal(true)
  protected readonly canResend = computed(() => this.resendWindowOpen() && this.resendsUsed() < MAX_OTP_LIMIT)
  protected readonly resendNote = signal<string | null>(null)

  private countdownSub?: Subscription
  private resendWindowSub?: Subscription

  constructor () {
    inject(DestroyRef).onDestroy(() => {
      this.countdownSub?.unsubscribe()
      this.resendWindowSub?.unsubscribe()
    })
  }

  protected async useMyLocation (): Promise<void> {
    this.locating.set(true)
    this.locationNote.set(null)
    const position = await getLocation()
    if (position === null) {
      this.locating.set(false)
      this.locationNote.set({ tone: 'danger', text: 'Location is off or blocked. Type the address instead.' })
      return
    }
    this.coords.set(position)
    this.geo.getAddress(position.lat, position.lon).subscribe({
      next: address => {
        this.details.patchValue({
          city: address.city ?? '',
          district: address.district ?? '',
          state: address.state ?? '',
          country: address.country ?? '',
          zip: address.zip !== undefined ? String(address.zip) : ''
        })
        this.locating.set(false)
        this.locationNote.set({ tone: 'success', text: 'Address filled in from your location. Check it before continuing.' })
      },
      error: () => {
        this.locating.set(false)
        this.locationNote.set({ tone: 'danger', text: "We couldn't look up that address. Type it instead." })
      }
    })
  }

  protected sendCode (): void {
    this.detailsSubmitted.set(true)
    if (this.details.invalid) return
    this.busy.set(true)
    const value = this.details.getRawValue()
    const trimmed = Object.fromEntries(Object.entries(value).map(([key, field]) => [key, key.toLowerCase().includes('password') ? field : field.trim()]))

    this.resolveCoords(value.city, value.country, Number(value.zip)).pipe(
      switchMap(coords => this.http.post<{ token: string }>('theater/register', {
        ...trimmed,
        latitude: coords?.lat,
        longitude: coords?.lon
      }))
    ).subscribe({
      next: res => {
        localStorage.setItem('theaterAuthToken', res.token) // identifies this sign-up when verifying and resending
        this.sentTo.set(value.email.trim())
        this.busy.set(false)
        this.step.set('verify')
        this.startCountdown()
        this.resendWindowSub = timer(OTP_RESEND_MAX_TIME).pipe(take(1)).subscribe(() => { this.resendWindowOpen.set(false) })
      },
      error: () => { this.busy.set(false) }
    })
  }

  protected verify (): void {
    this.otpSubmitted.set(true)
    if (this.otp.invalid || this.expired()) return
    this.busy.set(true)
    const authToken = localStorage.getItem('theaterAuthToken')
    this.http.post('theater/validateOtp', { otp: this.otp.value.trim(), authToken }).subscribe({
      next: () => {
        localStorage.removeItem('theaterAuthToken')
        void this.router.navigate(['/theater/approval/pending'])
      },
      error: () => { this.busy.set(false) }
    })
  }

  protected resendCode (): void {
    if (!this.canResend()) return
    this.http.get('theater/resendOtp').subscribe(() => {
      this.resendsUsed.update(count => count + 1)
      this.resendNote.set(`We sent a new code to ${this.sentTo()}.`)
      this.otp.reset()
      this.otpSubmitted.set(false)
      this.startCountdown()
    })
  }

  protected changeDetails (): void {
    this.countdownSub?.unsubscribe()
    this.step.set('details')
    this.resendNote.set(null)
    this.otp.reset()
    this.otpSubmitted.set(false)
  }

  /** Coordinates from "Use my location", else looked up from the address; null if the lookup fails */
  private resolveCoords (city: string, country: string, zip: number): Observable<Coords | null> {
    const known = this.coords()
    if (known !== null) return of(known)
    return this.geo.getCoords(city.trim(), country.trim(), zip).pipe(
      map(found => ({ lon: found.coordinates[0], lat: found.coordinates[1] })),
      catchError(() => of(null))
    )
  }

  private startCountdown (): void {
    this.countdownSub?.unsubscribe()
    this.secondsLeft.set(OTP_TIMER)
    this.countdownSub = timer(1000, 1000).pipe(
      take(OTP_TIMER),
      map(tick => OTP_TIMER - tick - 1)
    ).subscribe(left => { this.secondsLeft.set(left) })
  }
}
