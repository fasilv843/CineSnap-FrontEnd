/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, type OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { type AbstractControl, FormBuilder, type FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { validateByTrimming } from 'src/app/helpers/validations';
import { type IApiAdminAuthRes } from 'src/app/models/admin';
import { emailValidators, passwordValidators } from 'src/app/shared/valiators';
import { EmailValidationComponent } from '../../common/validation/email-validation/email-validation.component';
import { PasswordValidationComponent } from '../../common/validation/password-validation/password-validation.component';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, EmailValidationComponent, PasswordValidationComponent]
})
export class AdminLoginComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  isSubmitted = false
  form!: FormGroup

  ngOnInit (): void {
    this.form = this.formBuilder.group({
      email: ['', [validateByTrimming(emailValidators)]],
      password: ['', [validateByTrimming(passwordValidators)]]
    })
  }

  get f (): Record<string, AbstractControl> {
    return this.form.controls
  }

  onSubmit (): void {
    this.isSubmitted = true
    console.log(this.form.controls);
    if (!this.form.invalid) {
      const admin = this.form.getRawValue()
      console.log('sending http request')
      this.http.post<IApiAdminAuthRes>('admin/login', admin).subscribe({
        next: (res: IApiAdminAuthRes) => {
          localStorage.setItem('adminAccessToken', res.accessToken)
          localStorage.setItem('adminRefreshToken', res.refreshToken)
          void this.router.navigate(['/admin/home'])
        }
      })
    }
  }
}
