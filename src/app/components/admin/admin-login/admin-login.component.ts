/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core';
import { type AbstractControl, FormBuilder, type FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { emailRegex, passwordMinLength } from 'src/app/shared/constants';

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
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.minLength(passwordMinLength)]]
    });
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
      this.http.post('admin/login', admin).subscribe({
        next: (res: any) => {
          console.log('navigating to home', res.token)
          localStorage.setItem('adminToken', res.token)
          void this.router.navigate(['/admin/home'])
        },
        error: (err) => {
          console.log(err);
          void Swal.fire('Error', err.error.message, 'error')
        }
      })
    }
  }
}
