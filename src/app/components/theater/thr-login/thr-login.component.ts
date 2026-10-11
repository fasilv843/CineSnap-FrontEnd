import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { validateByTrimming } from 'src/app/helpers/validations'
import { type IApiTheaterAuthRes } from 'src/app/models/theater'
import { emailValidators, requiredValidator } from 'src/app/shared/valiators'
import { AuthShellComponent } from 'src/app/shared/ui/auth-shell.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { saveTheaterOnStore } from 'src/app/states/theater/theater.action'

@Component({
  selector: 'app-thr-login',
  templateUrl: './thr-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, ButtonDirective, FieldErrorComponent]
})
export class ThrLoginComponent {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly store = inject(Store)

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [validateByTrimming(emailValidators)] }),
    password: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] })
  })

  protected readonly messages = {
    email: { required: 'Enter your business email', pattern: 'Enter a valid email address' },
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
