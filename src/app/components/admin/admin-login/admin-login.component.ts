import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { validateByTrimming } from 'src/app/helpers/validations'
import { type IApiAdminAuthRes } from 'src/app/models/admin'
import { emailValidators, requiredValidator } from 'src/app/shared/valiators'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

@Component({
  selector: 'app-admin-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AuthShellComponent, ButtonDirective, FieldErrorComponent],
  template: `
    <cs-auth-shell heading="Admin sign in" subheading="For the CineSnap team only."
      pitch="Every theater, every seat, one place." pitchDetail="Approve theaters, manage movies and keep an eye on bookings and revenue.">
      <form [formGroup]="form" (ngSubmit)="signIn()" novalidate class="space-y-4">
        <div>
          <label for="email" class="mb-1.5 block text-sm font-semibold">Email</label>
          <input id="email" type="email" class="input" formControlName="email" autocomplete="username" />
          <cs-field-error [control]="form.controls.email" [submitted]="submitted()" [messages]="messages.email" />
        </div>
        <div>
          <label for="password" class="mb-1.5 block text-sm font-semibold">Password</label>
          <div class="relative">
            <input id="password" class="input pr-16" [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" />
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 rounded-control px-2 py-1 text-sm font-semibold text-muted hover:text-default"
              [attr.aria-pressed]="showPassword()" (click)="showPassword.set(!showPassword())">
              {{ showPassword() ? 'Hide' : 'Show' }}<span class="sr-only"> password</span>
            </button>
          </div>
          <cs-field-error [control]="form.controls.password" [submitted]="submitted()" [messages]="messages.password" />
        </div>
        <button csButton size="lg" type="submit" class="w-full" [disabled]="signingIn()">
          @if (signingIn()) { <span class="spinner"></span> Signing in… } @else { Sign in }
        </button>
      </form>
    </cs-auth-shell>
  `
})
export class AdminLoginComponent {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [validateByTrimming(emailValidators)] }),
    password: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] })
  })

  protected readonly messages = {
    email: { required: 'Enter your email', pattern: 'Enter a valid email address' },
    password: { required: 'Enter your password' }
  }

  protected readonly submitted = signal(false)
  protected readonly signingIn = signal(false)
  protected readonly showPassword = signal(false)

  protected signIn (): void {
    this.submitted.set(true)
    if (this.form.invalid) return
    this.signingIn.set(true)
    const { email, password } = this.form.getRawValue()
    // Wrong credentials are reported by the global HTTP error handler
    this.http.post<IApiAdminAuthRes>('admin/login', { email: email.trim(), password }).subscribe({
      next: res => {
        localStorage.setItem('adminAccessToken', res.accessToken)
        localStorage.setItem('adminRefreshToken', res.refreshToken)
        void this.router.navigate(['/admin/home'])
      },
      error: () => { this.signingIn.set(false) }
    })
  }
}
