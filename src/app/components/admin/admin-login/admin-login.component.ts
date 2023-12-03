/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core';
import { type AbstractControl, FormBuilder, type FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { validateByTrimming } from 'src/app/helpers/validations';
import { type IApiAdminAuthRes } from 'src/app/models/admin';
import { emailValidators, passwordValidators } from 'src/app/shared/valiators';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  isSubmitted = false
  form!: FormGroup

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder
  ) {}

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
