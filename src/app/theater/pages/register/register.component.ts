import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormField, form, maxLength } from '@angular/forms/signals'
import { Router, RouterLink } from '@angular/router'
import { type Observable, type Subscription, catchError, map, of, switchMap, take, timer } from 'rxjs'
import { getLocation } from 'src/app/shared/utils/location'
import { formatTime } from 'src/app/shared/utils/timer'
import { GeoLocationRepo } from 'src/app/shared/repos/geo-location.repo'
import { MAX_OTP_LIMIT, OTP_RESEND_MAX_TIME, OTP_TIMER } from 'src/app/core/constants/constants'
import { emailRules, matchRule, nameRules, newPasswordRules, otpRules, requiredText, zipRules } from 'src/app/shared/utils/form-rules'
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
  imports: [FormField, RouterLink, AuthShellComponent, ButtonDirective, FieldErrorComponent]
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

  private readonly detailsModel = signal({
    name: '',
    email: '',
    liscenceId: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    country: 'India',
    zip: '',
    password: '',
    repeatPassword: ''
  })

  protected readonly details = form(this.detailsModel, p => {
    nameRules(p.name, 'Enter the theater name')
    emailRules(p.email, 'Enter your business email')
    requiredText(p.liscenceId, 'Enter your theater licence number')
    requiredText(p.city, 'Enter the city')
    requiredText(p.district, 'Enter the district')
    requiredText(p.state, 'Enter the state')
    requiredText(p.country, 'Enter the country')
    zipRules(p.zip, 'Enter the PIN code', 'PIN codes are 6 digits')
    maxLength(p.zip, 6)
    newPasswordRules(p.password)
    matchRule(p.repeatPassword, p.password)
  })

  protected readonly detailsSubmitted = signal(false)


  // Where the theater is: from the browser, or looked up from the typed address when sending
  private readonly coords = signal<Coords | null>(null)
  protected readonly locating = signal(false)
  protected readonly locationNote = signal<{ tone: 'success' | 'danger', text: string } | null>(null)

  // Step 2: email code -------------------------------------------------------------

  protected readonly otp = signal('')
  protected readonly otpForm = form(this.otp, otpRules)
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
        this.detailsModel.update(value => ({
          ...value,
          city: address.city ?? '',
          district: address.district ?? '',
          state: address.state ?? '',
          country: address.country ?? '',
          zip: address.zip !== undefined ? String(address.zip) : ''
        }))
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
    if (this.details().invalid()) return
    this.busy.set(true)
    const value = this.detailsModel()
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
    if (this.otpForm().invalid() || this.expired()) return
    this.busy.set(true)
    const authToken = localStorage.getItem('theaterAuthToken')
    this.http.post('theater/validateOtp', { otp: this.otp().trim(), authToken }).subscribe({
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
      this.resetOtp()
      this.startCountdown()
    })
  }

  protected changeDetails (): void {
    this.countdownSub?.unsubscribe()
    this.step.set('details')
    this.resendNote.set(null)
    this.resetOtp()
  }

  private resetOtp (): void {
    this.otp.set('')
    this.otpForm().reset()
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
