/* eslint-disable @typescript-eslint/semi */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, type FormGroup, type AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environments } from 'src/environments/environment';
import Swal from 'sweetalert2';

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
  zip: number = 0
  latitude: number | undefined;
  longitude: number | undefined;

  constructor (
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router,
    @Inject(FormBuilder) private readonly fromBuilder: FormBuilder
  ) {}

  ngOnInit (): void {
    this.form = this.fromBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      landmark: [''],
      liscenceId: ['LI-ID3983KHS098SL', Validators.required],
      otp: [{ value: '', disabled: true }, Validators.required]
    })
  }

  get f (): Record<string, AbstractControl> {
    return this.form.controls
  }

  getLocation (): void {
    console.log('location radio clicked');
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition()
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position, 'position');
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(this.longitude, this.latitude);
        this.callGeoLocationAPI(this.latitude, this.longitude);
      });
    } else {
      console.log('No support for geolocation')
    }
  }

  callGeoLocationAPI (lat: number, lon: number): void {
    const httpOptions = {
      headers: new HttpHeaders({ 'Bypass-Interceptor': 'true' })
    }
    console.log(lat, lon, 'lat, lon');

    const { geoapifyApi, geoapifyKey } = environments
    this.http.get(`${geoapifyApi}?lat=${lat}&lon=${lon}&apiKey=${geoapifyKey}`, httpOptions).subscribe({
      next: (res: any) => {
        console.log(res)
        this.country = res.features[0].properties.country
        this.state = res.features[0].properties.state
        this.district = res.features[0].properties.state_district
        this.city = res.features[0].properties.city
        this.zip = res.features[0].properties.postcode
      },
      error: (e) => { console.error(e); },
      complete: () => { console.info('complete') }
    })
  }

  onSubmit (): void {
    this.isSubmitted = true

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
        },
        error: (err) => {
          void Swal.fire('Error', err.message, 'error')
        }
      })
    } else if (!this.form.invalid && this.showOtpField) {
      // const otp: number = this.form.get('otp').value;
      const theater = this.form.getRawValue()
      console.log(theater);
      console.log(theater.otp);
      const otp = theater.otp
      this.http.post('theater/validateOtp', { otp }).subscribe({
        next: () => {
          void this.router.navigate(['/theater/home'])
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
