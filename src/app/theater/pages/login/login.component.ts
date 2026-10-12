import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormField, form } from '@angular/forms/signals'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { type IApiTheaterAuthRes } from 'src/app/core/models/theater.model'
import { emailRules, requiredText } from 'src/app/shared/utils/form-rules'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { saveTheaterOnStore } from 'src/app/core/state/theater/theater.action'

@Component({
  selector: 'app-thr-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink, AuthShellComponent, ButtonDirective, FieldErrorComponent]
})
export class TheaterLoginComponent {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly store = inject(Store)

  private readonly model = signal({ email: '', password: '' })
  protected readonly form = form(this.model, p => {
    emailRules(p.email, 'Enter your business email')
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
    this.http.post<IApiTheaterAuthRes>('theater/login', { email: email.trim(), password }).subscribe({
      next: res => {
        this.signingIn.set(false)
        const theater = res.data
        if (theater === null) return
        if (theater.approvalStatus === 'Approved') {
          this.store.dispatch(saveTheaterOnStore({ theaterDetails: theater }))
          localStorage.setItem('theaterAccessToken', res.accessToken)
          localStorage.setItem('theaterRefreshToken', res.refreshToken)
          void this.router.navigate(['/theater/home'])
        } else if (theater.approvalStatus === 'Pending') {
          void this.router.navigate(['/theater/approval/pending'])
        } else {
          void this.router.navigate(['/theater/approval/rejected'], { queryParams: { reason: 'Rejection' } })
        }
      },
      error: () => { this.signingIn.set(false) }
    })
  }
}
