/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core'
import { FormBuilder, type FormGroup, Validators, type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { OTPRegex, emailRegex, nameRegex, passwordMinLength, userNameMaxLength, userNameMinLength } from 'src/app/shared/constants';
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
      name: ['', [Validators.required, Validators.minLength(userNameMinLength), Validators.maxLength(userNameMaxLength), Validators.pattern(nameRegex)]],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.minLength(passwordMinLength)]],
      repeatPassword: ['', Validators.required],
      otp: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(OTPRegex)]]
    }, {
      validators: this.passwordMatchValidator
    })
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');

    if ((password != null) && (repeatPassword != null) && password.value !== repeatPassword.value) {
      repeatPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    repeatPassword?.setErrors(null);
    return null
  };

  /// { [key: string]: AbstractControl }
  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  onSubmit (): void {
    this.isSubmitted = true
    console.log(this.form.invalid)
    if (!this.form.invalid && !this.showOtpField) {
      const user = this.form.getRawValue()
      this.http.post('user/register', user).subscribe({
        next: () => {
          this.showOtpField = true
          this.form.get('name')?.disable()
          this.form.get('email')?.disable()
          this.form.get('password')?.disable()
          this.form.get('repeatPassword')?.disable()
          this.form.get('otp')?.enable();
        },
        error: (err) => {
          void Swal.fire('Error', err.message, 'error')
        }
      })
    } else if (!this.form.invalid && this.showOtpField) {
      // const otp: number = this.form.get('otp').value;
      const user = this.form.getRawValue()
      console.log(user);
      console.log(user.otp);
      const otp = user.otp
      this.http.post('user/validateOtp', { otp }).subscribe({
        next: () => {
          void this.router.navigate(['/'])
        },
        error: (err) => {
          void Swal.fire('Error', err.message, 'error')
        }
      })
    } else {
      console.log('error', this.form.errors)
    }
  }
}
