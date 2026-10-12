import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormField, form } from '@angular/forms/signals'
import { Router } from '@angular/router'
import { type IApiAdminAuthRes } from 'src/app/core/models/admin.model'
import { emailRules, requiredText } from 'src/app/shared/utils/form-rules'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

@Component({
  selector: 'app-admin-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, AuthShellComponent, ButtonDirective, FieldErrorComponent],
  template: `
    <cs-auth-shell heading="Admin sign in" subheading="For the CineSnap team only."
      pitch="Every theater, every seat, one place." pitchDetail="Approve theaters, manage movies and keep an eye on bookings and revenue.">
      <form (submit)="$event.preventDefault(); signIn()" novalidate class="space-y-4">
        <div>
          <label for="email" class="mb-1.5 block text-sm font-semibold">Email</label>
          <input id="email" type="email" class="input" [formField]="form.email" autocomplete="username" />
          <cs-field-error [field]="form.email" [submitted]="submitted()" />
        </div>
        <div>
          <label for="password" class="mb-1.5 block text-sm font-semibold">Password</label>
          <div class="relative">
            <input id="password" class="input pr-16" [type]="showPassword() ? 'text' : 'password'" [formField]="form.password" autocomplete="current-password" />
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 rounded-control px-2 py-1 text-sm font-semibold text-muted hover:text-default"
              [attr.aria-pressed]="showPassword()" (click)="showPassword.set(!showPassword())">
              {{ showPassword() ? 'Hide' : 'Show' }}<span class="sr-only"> password</span>
            </button>
          </div>
          <cs-field-error [field]="form.password" [submitted]="submitted()" />
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

  private readonly model = signal({ email: '', password: '' })
  protected readonly form = form(this.model, p => {
    emailRules(p.email)
    requiredText(p.password, 'Enter your password')
  })


  protected readonly submitted = signal(false)
  protected readonly signingIn = signal(false)
  protected readonly showPassword = signal(false)

  protected signIn (): void {
    this.submitted.set(true)
    if (this.form().invalid()) return
    this.signingIn.set(true)
    const { email, password } = this.model()
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
