/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, type FormGroup, type AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getLocation } from 'src/app/helpers/location';
import { formatTime } from 'src/app/helpers/timer';
import { passwordMatchValidator, validateByTrimming } from 'src/app/helpers/validations';
import { type IApiTheaterRes } from 'src/app/models/theater';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { MAX_OTP_LIMIT, OTP_RESEND_MAX_TIME, OTP_TIMER } from 'src/app/shared/constants';
import { emailValidators, nameValidators, otpValidators, passwordValidators, requiredValidator, zipValidators } from 'src/app/shared/valiators';
import { saveTheaterOnStore } from 'src/app/states/theater/theater.action';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thr-register',
  templateUrl: './thr-register.component.html',
  styleUrls: ['./thr-register.component.css']
})
export class ThrRegisterComponent {
  isSubmitted = false
  showOtpField = false
  remainingTime = 0
  formattedTime: string = '03:00'
  otpResendCount: number = 0
  showOTPResend: boolean = true
  getLocationClicked = false
  form!: FormGroup
  country: string = ''
  state: string = ''
  district: string = ''
  city: string = ''
  zip: string = ''
  latitude: number | undefined;
  longitude: number | undefined;

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(FormBuilder) private readonly fromBuilder: FormBuilder,
    @Inject(Store) private readonly store: Store,
    @Inject(GeoLocationService) private readonly locationService: GeoLocationService
  ) {}

  ngOnInit (): void {
    this.form = this.fromBuilder.group({
      name: ['', [validateByTrimming(nameValidators)]],
      email: ['', [validateByTrimming(emailValidators)]],
      password: ['', [validateByTrimming(passwordValidators)]],
      repeatPassword: [''],
      country: ['', [validateByTrimming(requiredValidator)]],
      state: ['', [validateByTrimming(requiredValidator)]],
      district: ['', [validateByTrimming(requiredValidator)]],
      city: ['', [validateByTrimming(requiredValidator)]],
      zip: ['', [validateByTrimming(zipValidators)]],
      landmark: [''],
      liscenceId: ['LI-ID3983KHS098SL', [validateByTrimming(requiredValidator)]],
      otp: [{ value: '', disabled: true }, [validateByTrimming(otpValidators)]]
    }, { validators: passwordMatchValidator })
  }

  startTimer (): void {
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

  resendOTP (): void {
    if (this.otpResendCount < MAX_OTP_LIMIT) {
      this.http.get('theater/resendOtp').subscribe({
        next: () => {
          console.log('otp successfully resent');
          void Swal.fire('OTP sent', 'Check your mail for OTP', 'success');
          this.startTimer();
          this.otpResendCount++;
        }
      });
    } else {
      void Swal.fire('Oops!', 'Maximum resend attempts reached', 'warning');
    }
  }

  get f (): Record<string, AbstractControl> {
    return this.form.controls
  }

  async autoFillAddress (): Promise<void> {
    const coords = await getLocation()
    if (coords !== null) {
      console.log(coords, 'coords from getLocation');
      this.longitude = coords.lon
      this.latitude = coords.lat
      this.locationService.getAddress(coords.lat, coords.lon).subscribe({
        next: (res) => {
          console.log(res, 'res from getAddress');
          this.country = res.country
          this.state = res.state
          this.district = res.district
          this.city = res.city
          this.zip = String(res.zip)
        }
      })
    }
  }

  onSubmit (): void {
    this.isSubmitted = true
    console.log('submitted');
    if (!this.form.invalid && !this.showOtpField) {
      const theater = this.form.getRawValue()
      theater.latitude = this.latitude
      theater.longitude = this.longitude
      console.log(theater, 'theater data that passed to backend');
      this.http.post('theater/register', theater).subscribe({
        next: (res: any) => {
          localStorage.setItem('theaterAuthToken', res.token)
          this.showOtpField = true
          this.form.get('name')?.disable()
          this.form.get('email')?.disable()
          this.form.get('country')?.disable()
          this.form.get('state')?.disable()
          this.form.get('district')?.disable()
          this.form.get('city')?.disable()
          this.form.get('zip')?.disable()
          this.form.get('liscenceId')?.disable()
          this.form.get('password')?.disable()
          this.form.get('repeatPassword')?.disable()
          this.form.get('landmark')?.disable()
          this.form.get('otp')?.enable()
          this.startTimer()
          setTimeout(() => {
            this.showOTPResend = false
          }, OTP_RESEND_MAX_TIME)
        }
      })
    } else if (!this.form.invalid && this.showOtpField) {
      const theater = this.form.getRawValue()
      console.log(theater);
      console.log(theater.otp);
      const authToken = localStorage.getItem('theaterAuthToken')
      const otp = theater.otp
      this.http.post<IApiTheaterRes>('theater/validateOtp', { otp, authToken }).subscribe({
        next: (res: IApiTheaterRes) => {
          this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
          localStorage.setItem('theaterToken', res.token)
          localStorage.removeItem('theaterAuthToken')
          void this.router.navigate(['/theater/home'])
        }
      })
    } else {
      console.log('error', this.form.errors)
    }
  }
}
