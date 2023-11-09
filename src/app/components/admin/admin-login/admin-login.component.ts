/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core';
import { type AbstractControl, FormBuilder, type FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    @Inject(FormBuilder) private readonly fromBuilder: FormBuilder
  ) {}

  ngOnInit (): void {
    this.form = this.fromBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    })
  }

  get f (): Record<string, AbstractControl> {
    return this.form.controls
  }

  onSubmit (): void {
    this.isSubmitted = true
    if (!this.form.invalid) {
      const admin = this.form.getRawValue()
      console.log('sending http request')
      this.http.post('admin/login', admin).subscribe(
        (res: any) => {
          console.log('navigating to home', res.token)
          localStorage.setItem('adminToken', res.token)
          void this.router.navigate(['/admin/home'])
        },
        (err) => {
          void Swal.fire('Error', err.message, 'error')
        }
      )
    }
  }
}
