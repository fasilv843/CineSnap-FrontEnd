import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormField, form } from '@angular/forms/signals'
import { RouterLink } from '@angular/router'
import { type Subscription, map, take, timer } from 'rxjs'
import { formatTime } from 'src/app/shared/utils/timer'
import { type IApiUserAuthRes } from 'src/app/core/models/user.model'
import { MAX_OTP_LIMIT, OTP_RESEND_MAX_TIME, OTP_TIMER } from 'src/app/core/constants/constants'
import { emailRules, matchRule, nameRules, newPasswordRules, otpRules } from 'src/app/shared/utils/form-rules'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { GoogleButtonComponent } from '../../components/google-button.component'
import { connectGoogleSignIn, injectStartSession } from '../../utils/user-session'

type Step = 'details' | 'verify'

/** Sign-up in two steps: account details, then the 4-digit code the backend emails. */
@Component({
  selector: 'app-user-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink, ButtonDirective, FieldErrorComponent, AuthShellComponent, GoogleButtonComponent]
})
export class UserRegisterComponent {
  private readonly http = inject(HttpClient)
  private readonly startSession = injectStartSession()

  protected readonly step = signal<Step>('details')
  /** Where the code was sent, shown on the code step */
  protected readonly sentTo = signal('')
  protected readonly busy = signal(false)
  protected readonly googleFailed = signal(false)
  protected readonly showPassword = signal(false)

  // Step 1: details -------------------------------------------------------------

  private readonly detailsModel = signal({ name: '', email: '', password: '', repeatPassword: '' })
  protected readonly details = form(this.detailsModel, p => {
    nameRules(p.name)
    emailRules(p.email)
    newPasswordRules(p.password)
    matchRule(p.repeatPassword, p.password)
  })

  protected readonly detailsSubmitted = signal(false)


  // Step 2: email code -------------------------------------------------------------

  protected readonly otp = signal('')
  protected readonly otpForm = form(this.otp, otpRules)
  protected readonly otpSubmitted = signal(false)

  // Seconds until the current code expires
  protected readonly secondsLeft = signal(0)
  protected readonly countdown = computed(() => formatTime(this.secondsLeft()))
  protected readonly expired = computed(() => this.step() === 'verify' && this.secondsLeft() === 0)

  // Resending is allowed a few times, and only within a window after sign-up starts
  protected readonly resendsUsed = signal(0)
  protected readonly resendWindowOpen = signal(true)
  protected readonly canResend = computed(() => this.resendWindowOpen() && this.resendsUsed() < MAX_OTP_LIMIT)
  protected readonly resendNote = signal<string | null>(null)

  private countdownSub?: Subscription

  constructor () {
    connectGoogleSignIn(() => { this.googleFailed.set(true) })
    inject(DestroyRef).onDestroy(() => this.countdownSub?.unsubscribe())
  }

  protected sendCode (): void {
    this.detailsSubmitted.set(true)
    if (this.details().invalid()) return
    const { name, email, password, repeatPassword } = this.detailsModel()
    this.busy.set(true)
    this.http.post<{ token: string }>('user/register', { name: name.trim(), email: email.trim(), password, repeatPassword }).subscribe({
      next: res => {
        localStorage.setItem('userAuthToken', res.token) // identifies this sign-up when verifying and resending the code
        this.sentTo.set(email.trim())
        this.busy.set(false)
        this.step.set('verify')
        this.startCountdown()
        timer(OTP_RESEND_MAX_TIME).pipe(take(1)).subscribe(() => { this.resendWindowOpen.set(false) })
      },
      error: () => { this.busy.set(false) }
    })
  }

  protected verify (): void {
    this.otpSubmitted.set(true)
    if (this.otpForm().invalid() || this.expired()) return
    this.busy.set(true)
    this.http.post<IApiUserAuthRes>('user/validateOtp', { otp: this.otp().trim() }).subscribe({
      next: res => { this.startSession(res) },
      error: () => { this.busy.set(false) }
    })
  }

  protected resendCode (): void {
    if (!this.canResend()) return
    this.http.get('user/resendOtp').subscribe(() => {
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

  private startCountdown (): void {
    this.countdownSub?.unsubscribe()
    this.secondsLeft.set(OTP_TIMER)
    this.countdownSub = timer(1000, 1000).pipe(
      take(OTP_TIMER),
      map(tick => OTP_TIMER - tick - 1)
    ).subscribe(left => { this.secondsLeft.set(left) })
  }
}
