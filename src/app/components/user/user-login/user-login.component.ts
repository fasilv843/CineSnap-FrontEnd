/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { type FormGroup, FormBuilder, Validators, type AbstractControl } from '@angular/forms'
import Swal from 'sweetalert2';

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
    @Inject(FormBuilder) private readonly fromBuilder: FormBuilder
  ) {}

  ngOnInit (): void {
    this.form = this.fromBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    })
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
      this.http.post('user/login', user).subscribe(
        (res: any) => {
          console.log('navigating to home', res.token);
          localStorage.setItem('userToken', res.token)
          void this.router.navigate(['/'])
        },
        (err) => {
          void Swal.fire('Error', err.message, 'error')
        }
      )
    }
  }
}
