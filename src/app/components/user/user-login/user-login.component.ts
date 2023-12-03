/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { type FormGroup, FormBuilder, type AbstractControl } from '@angular/forms'
import { Store } from '@ngrx/store';
import { saveUserOnStore } from 'src/app/states/user/user.actions';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { validateByTrimming } from 'src/app/helpers/validations';
import { emailValidators, passwordValidators } from 'src/app/shared/valiators';
import { IApiUserAuthRes } from 'src/app/models/users';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  isSubmitted = false
  form!: FormGroup

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(SocialAuthService) private readonly authService: SocialAuthService,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.form = this.formBuilder.group({
      email: ['', [validateByTrimming(emailValidators)]],
      password: ['', [validateByTrimming(passwordValidators)]]
    })

    this.authService.authState.subscribe((user) => {
      const userData = {
        name: user.name,
        email: user.email,
        profilePic: user.photoUrl
      }

      console.log(user, 'user from auth service');
      this.http.post('user/auth/google', userData).subscribe({
        next: (res: any) => {
          localStorage.setItem('userToken', res.token)
          this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
          void this.router.navigate(['/'])
        }
      })
    });
  }

  get f (): Record<string, AbstractControl> {
    return this.form.controls;
  }

  onSubmit (): void {
    this.isSubmitted = true
    console.log('login submitted');
    if (!this.form.invalid) {
      const user = this.form.getRawValue()
      console.log('sending http request');
      this.http.post<IApiUserAuthRes>('user/login', user).subscribe({
        next: (res: IApiUserAuthRes) => {
          console.log('navigating to home', res);
          if (res.data !== null) {
            localStorage.setItem('userAccessToken', res.accessToken)
            localStorage.setItem('userRefreshToken', res.refreshToken)
            this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
            void this.router.navigate(['/'])
          }
        }
      })
    }
  }
}
