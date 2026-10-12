import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormField, form } from '@angular/forms/signals'
import { RouterLink } from '@angular/router'
import { type IApiUserAuthRes } from 'src/app/core/models/user.model'
import { passwordMinLength, passwordRegex } from 'src/app/core/constants/constants'
import { emailRules, textRules } from 'src/app/shared/utils/form-rules'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { GoogleButtonComponent } from '../../components/google-button.component'
import { connectGoogleSignIn, injectStartSession } from '../../utils/user-session'

@Component({
  selector: 'app-user-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink, ButtonDirective, FieldErrorComponent, AuthShellComponent, GoogleButtonComponent]
})
export class UserLoginComponent {
  private readonly http = inject(HttpClient)
  private readonly startSession = injectStartSession()

  private readonly model = signal({ email: '', password: '' })
  protected readonly form = form(this.model, p => {
    emailRules(p.email)
    // Only "required" matters when signing in; strength rules apply at sign-up
    textRules(p.password, {
      required: 'Enter your password',
      minLength: [passwordMinLength, 'That password is too short'],
      pattern: [passwordRegex, 'Check your password and try again']
    })
  })


  protected readonly submitted = signal(false)
  protected readonly signingIn = signal(false)
  protected readonly showPassword = signal(false)
  protected readonly googleFailed = signal(false)

  constructor () {
    connectGoogleSignIn(() => { this.googleFailed.set(true) })
  }

  protected signIn (): void {
    this.submitted.set(true)
    if (this.form().invalid()) return
    this.signingIn.set(true)
    const { email, password } = this.model()
    // Wrong credentials are reported by the global HTTP error handler
    this.http.post<IApiUserAuthRes>('user/login', { email: email.trim(), password }).subscribe({
      next: res => { this.startSession(res) },
      error: () => { this.signingIn.set(false) }
    })
  }
}
