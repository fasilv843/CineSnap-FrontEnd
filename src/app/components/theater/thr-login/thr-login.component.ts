/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, type FormGroup, type AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { validateByTrimming } from 'src/app/helpers/validations';
import { type IApiTheaterAuthRes } from 'src/app/models/theater';

import { emailValidators, passwordValidators } from 'src/app/shared/valiators';
import { saveTheaterOnStore } from 'src/app/states/theater/theater.action';

@Component({
  selector: 'app-thr-login',
  templateUrl: './thr-login.component.html',
  styleUrls: ['./thr-login.component.css']
})
export class ThrLoginComponent {
  isSubmitted = false
  form!: FormGroup

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.form = this.formBuilder.group({
      email: ['', [validateByTrimming(emailValidators)]],
      password: ['', [validateByTrimming(passwordValidators)]]
    })
  }

  get f (): Record<string, AbstractControl> {
    return this.form.controls;
  }

  onSubmit (): void {
    this.isSubmitted = true
    console.log('login submitted');
    if (!this.form.invalid) {
      const theater = this.form.getRawValue()
      console.log('sending http request');
      this.http.post<IApiTheaterAuthRes>('theater/login', theater).subscribe({
        next: (res: IApiTheaterAuthRes) => {
          if (res.data !== null) {
            if (res.data.approvalStatus === 'Approved') {
              this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
              localStorage.setItem('theaterAccessToken', res.accessToken)
              localStorage.setItem('theaterRefreshToken', res.refreshToken)
              void this.router.navigate(['/theater/home'])
            } else if (res.data.approvalStatus === 'Pending') {
              void this.router.navigate(['/theater/approval/pending'])
            } else if (res.data.approvalStatus === 'Rejected') {
              void this.router.navigate(['/theater/approval/rejected'])
            }
          }
        }
      })
    }
  }
}
