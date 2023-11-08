/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core'
import { FormBuilder, type FormGroup, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false
  showOtpField = false

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(FormBuilder) private readonly fromBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fromBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      otp: [{ value: '', disabled: true }, Validators.required]
    }, {
      validators: this.passwordMatchValidator
    })
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;

    // check if the password and repeatPassword match
    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  /// { [key: string]: AbstractControl }
  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  onSubmit (): void {
    this.isSubmitted = true
    console.log(this.form.invalid)
    if (!this.form.invalid && !this.showOtpField) {
      const user = this.form.getRawValue()
      this.http.post('user/register', user).subscribe(
        () => {
          this.showOtpField = true
          this.form.get('otp')?.enable();
          // localStorage.setItem('jwt', '')
          // void this.router.navigate(['/']);
        },
        (err) => {
          void Swal.fire('Error', err.message, 'error')
        }
      )
    } else if (!this.form.invalid && this.showOtpField) {
      // const otp: number = this.form.get('otp').value;
      const user = this.form.getRawValue()
      console.log(user);
      console.log(user.otp);
      const otp = user.otp
      this.http.post('user/validateOtp', { otp }).subscribe(
        () => {
          void this.router.navigate(['/'])
        },
        (err) => {
          void Swal.fire('Error', err.message, 'error')
        }
      )
    } else {
      console.log('error', this.form.errors)
    }
  }
}
