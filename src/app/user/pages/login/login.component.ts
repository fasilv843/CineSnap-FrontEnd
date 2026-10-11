import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { validateByTrimming } from 'src/app/helpers/validations'
import { type IApiUserAuthRes } from 'src/app/models/users'
import { emailValidators, passwordValidators } from 'src/app/shared/valiators'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { GoogleButtonComponent } from '../auth/google-button.component'
import { connectGoogleSignIn, injectStartSession } from '../auth/user-session'

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, FieldErrorComponent, AuthShellComponent, GoogleButtonComponent]
})
export class UserLoginComponent {
  private readonly http = inject(HttpClient)
  private readonly startSession = injectStartSession()

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [validateByTrimming(emailValidators)] }),
    password: new FormControl('', { nonNullable: true, validators: [validateByTrimming(passwordValidators)] })
  })

  protected readonly messages = {
    email: { required: 'Enter your email', pattern: 'Enter a valid email address' },
    // Only "required" matters when signing in; strength rules apply at sign-up
    password: { required: 'Enter your password', minlength: 'That password is too short', pattern: 'Check your password and try again' }
  }

  protected readonly submitted = signal(false)
  protected readonly signingIn = signal(false)
  protected readonly showPassword = signal(false)
  protected readonly googleFailed = signal(false)

  constructor () {
    connectGoogleSignIn(() => { this.googleFailed.set(true) })
  }

  protected signIn (): void {
    this.submitted.set(true)
    if (this.form.invalid) return
    this.signingIn.set(true)
    const { email, password } = this.form.getRawValue()
    // Wrong credentials are reported by the global HTTP error handler
    this.http.post<IApiUserAuthRes>('user/login', { email: email.trim(), password }).subscribe({
      next: res => { this.startSession(res) },
      error: () => { this.signingIn.set(false) }
    })
  }
}
