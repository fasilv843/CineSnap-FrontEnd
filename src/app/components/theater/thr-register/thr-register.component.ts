/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, type FormGroup, type AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getLocation } from 'src/app/helpers/location';
import { passwordMatchValidator, validateByTrimming } from 'src/app/helpers/validations';
import { type IApiTheaterRes } from 'src/app/models/theater';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { emailValidators, nameValidators, otpValidators, passwordValidators, requiredValidator, zipValidators } from 'src/app/shared/valiators';
import { saveTheaterOnStore } from 'src/app/states/theater/theater.action';
// import { environments } from 'src/environments/environment';

@Component({
  selector: 'app-thr-register',
  templateUrl: './thr-register.component.html',
  styleUrls: ['./thr-register.component.css']
})
export class ThrRegisterComponent {
  isSubmitted = false
  showOtpField = false
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

  get f (): Record<string, AbstractControl> {
    return this.form.controls
  }

  async autoFillAddress (): Promise<void> {
    const coords = await getLocation()
    if (coords !== null) {
      console.log(coords, 'coords from getLocation');
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
      this.http.post('theater/register', theater).subscribe({
        next: () => {
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
        }
      })
    } else if (!this.form.invalid && this.showOtpField) {
      const theater = this.form.getRawValue()
      console.log(theater);
      console.log(theater.otp);
      const otp = theater.otp
      this.http.post<IApiTheaterRes>('theater/validateOtp', { otp }).subscribe({
        next: (res: IApiTheaterRes) => {
          this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
          localStorage.setItem('theaterToken', res.token)
          void this.router.navigate(['/theater/home'])
        }
      })
    } else {
      console.log('error', this.form.errors)
    }
  }
}
