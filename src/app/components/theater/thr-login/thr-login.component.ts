/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, type FormGroup, type AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { validateByTrimming } from 'src/app/helpers/validations';

import { emailValidators, passwordValidators } from 'src/app/shared/valiators';
import Swal from 'sweetalert2';

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
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder
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
      this.http.post('theater/login', theater).subscribe({
        next: (res: any) => {
          console.log('navigating to home', res.token);
          localStorage.setItem('theaterToken', res.token)
          void this.router.navigate(['/theater/home'])
        },
        error: (err) => {
          void Swal.fire('Error', err.error.message, 'error')
        }
      })
    }
  }
}
