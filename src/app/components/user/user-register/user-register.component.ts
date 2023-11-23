/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core'
import { FormBuilder, type FormGroup, Validators, type AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MAX_OTP_LIMIT,
  OTPRegex,
  OTP_TIMER,
  emailRegex,
  nameRegex,
  passwordMinLength,
  userNameMaxLength,
  userNameMinLength
} from 'src/app/shared/constants';
import Swal from 'sweetalert2';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { saveUserOnStore } from 'src/app/states/user/user.actions';
import { Store } from '@ngrx/store';
import { formatTime } from 'src/app/helpers/timer';
import { passwordMatchValidator } from 'src/app/helpers/validations';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false
  showOtpField = false
  loggedIn: boolean = false;
  remainingTime = 0
  formattedTime: string = '03:00'
  otpResendCount: number = 0
  showOTPResend: boolean = true

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(FormBuilder) private readonly fromBuilder: FormBuilder,
    @Inject(SocialAuthService) private readonly authService: SocialAuthService,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.form = this.fromBuilder.group({
      name: ['', [Validators.required, Validators.minLength(userNameMinLength), Validators.maxLength(userNameMaxLength), Validators.pattern(nameRegex)]],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.minLength(passwordMinLength)]],
      repeatPassword: ['', Validators.required],
      otp: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(OTPRegex)]]
    }, {
      validators: passwordMatchValidator
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
        },
        error: (err) => {
          console.error(err);
          void Swal.fire('Error', err.error.message, 'error')
        }
      })
    });
  }

  // registerWithGoogle(): void {
  //   console.log('registering with google');
  //   void this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  startTimer(): void {
    this.remainingTime = OTP_TIMER;

    const timer = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(timer);
        // Handle expiration logic here
        console.log('OTP expired');
      }
      this.formattedTime = formatTime(this.remainingTime)
    }, 1000); // Update every second
  }

  resendOTP(): void {
    if (this.otpResendCount < MAX_OTP_LIMIT) {
      this.http.get('user/resendOtp').subscribe({
        next: () => {
          console.log('otp successfully resent');
          void Swal.fire('OTP sent', 'Check your mail for OTP', 'success');
          this.startTimer();
          this.otpResendCount++;
        },
        error: (err) => {
          void Swal.fire('Error', err.error.message, 'error');
        }
      });
    } else {
      void Swal.fire('Oops!', 'Maximum resend attempts reached', 'warning');
    }
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
      this.http.post('user/register', user).subscribe({
        next: (res: any) => {
          localStorage.setItem('userAuthToken', res.token)
          this.showOtpField = true
          this.form.get('name')?.disable()
          this.form.get('email')?.disable()
          this.form.get('password')?.disable()
          this.form.get('repeatPassword')?.disable()
          this.form.get('otp')?.enable();
          this.startTimer()
          setTimeout(() => {
            this.showOTPResend = false
          }, 1000 * 60 * 10)
        },
        error: (err) => {
          void Swal.fire('Error', err.error.message, 'error')
        }
      })
    } else if (!this.form.invalid && this.showOtpField) {
      // const otp: number = this.form.get('otp').value;
      const user = this.form.getRawValue()
      console.log(user);
      console.log(user.otp);
      const otp = user.otp
      this.http.post('user/validateOtp', { otp }).subscribe({
        next: (res: any) => {
          localStorage.setItem('userToken', res.token)
          localStorage.removeItem('userAuthToken')
          this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
          void this.router.navigate(['/'])
        },
        error: (err) => {
          void Swal.fire('Error', err.error.message, 'error')
        }
      })
    } else {
      console.log('error', this.form.errors)
    }
  }
}
