import { Component, Inject } from '@angular/core'
import { FormBuilder, type FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { getLocation } from 'src/app/helpers/location'
import { validateByTrimming } from 'src/app/helpers/validations'
import { type ICoords, type ITheaterAddress } from 'src/app/models/common'
import { type ITheaterUpdate, type ITheaterRes } from 'src/app/models/theater'
import { GeoLocationService } from 'src/app/services/geo-location.service'
import { TheaterService } from 'src/app/services/theater.service'
import { nameValidators, mobileValidators, requiredValidator, zipValidators } from 'src/app/shared/valiators'
import { saveTheaterOnStore } from 'src/app/states/theater/theater.action'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { environments } from 'src/environments/environment'

@Component({
  selector: 'app-edit-theater-profile',
  templateUrl: './edit-theater-profile.component.html',
  styleUrls: ['./edit-theater-profile.component.css']
})
export class EditTheaterProfileComponent {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  theater: ITheaterRes | null = null
  theaterId = ''
  profileForm!: FormGroup
  isSubmitted = false
  longitude: number = 0
  latitude: number = 0
  dpUrl: string = ''

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(TheaterService) private readonly theaterService: TheaterService,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(GeoLocationService) private readonly locationService: GeoLocationService
  ) {}

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.theaterId = params['theaterId']
      console.log(this.theaterId, 'screenId from route.params in ngOnInit')
    })

    this.profileForm = this.formBuilder.group({
      name: ['', [validateByTrimming(nameValidators)]],
      mobile: ['', [validateByTrimming(mobileValidators)]],
      city: ['', [validateByTrimming(requiredValidator)]],
      district: ['', [validateByTrimming(requiredValidator)]],
      state: ['', [validateByTrimming(requiredValidator)]],
      country: ['', [validateByTrimming(requiredValidator)]],
      zip: ['', [validateByTrimming(zipValidators)]],
      landmark: ['']
    })

    this.theaterDetails$.subscribe(theater => {
      if (theater !== null) {
        this.theater = theater
        if (theater.profilePic !== undefined) this.dpUrl = environments.backendUrl + `/images/${theater.profilePic}`
        this.profileForm.get('name')?.setValue(this.theater.name)
        this.profileForm.get('mobile')?.setValue((this.theater.mobile != null) ? String(this.theater.mobile) : '')
        if (this.theater.address != null) {
          this.profileForm.get('city')?.setValue(theater.address.city)
          this.profileForm.get('district')?.setValue(theater.address.district)
          this.profileForm.get('state')?.setValue(theater.address.state)
          this.profileForm.get('country')?.setValue(theater.address.country)
          this.profileForm.get('zip')?.setValue(String(theater.address.zip))
          this.profileForm.get('landmark')?.setValue(theater.address.landmark)
        }
        this.longitude = theater.coords.coordinates[0]
        this.latitude = theater.coords.coordinates[1]
      }
    })
  }

  imageReady (blob: Blob): void {
    console.log(blob, 'event from imageReady in edit thr profile')
    const formData = new FormData()
    formData.append('image', blob, this.theater?.name + '.jpg')

    this.theaterService.updateTheaterProfilePic(this.theaterId, formData).subscribe({
      next: (res) => {
        console.log('image upload complete')
        if (res.data != null) {
          this.dpUrl = environments.backendUrl + `/images/${res.data.profilePic}`
          this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
        }
      },
      error: () => {
        this.dpUrl = ''
      }
    })
  }

  deleteProfilePic (): void {
    console.warn('deleting dp')
    this.theaterService.deleteTheaterProfilePic(this.theaterId).subscribe({
      next: (res) => {
        this.dpUrl = ''
        console.warn('profile deleted successfully', res.data.profilePic, 'see, its undefined')
        if (res.data != null) this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
      }
    })
  }

  onSubmit (): void {
    this.isSubmitted = true
    if (this.profileForm.valid) {
      const theaterData = this.profileForm.getRawValue()
      this.locationService.getCoords(theaterData.city, theaterData.country, theaterData.zip).subscribe({
        next: (res) => {
          console.log('city changed, new coords', res)
          this.longitude = res.coordinates[0]
          this.latitude = res.coordinates[1]
        }
      })

      const coords: ICoords = { type: 'Point', coordinates: [this.longitude, this.latitude] }
      const address: ITheaterAddress = {
        city: theaterData.city,
        district: theaterData.district,
        state: theaterData.state,
        country: theaterData.country,
        zip: theaterData.zip,
        landmark: theaterData.landmark
      }
      const theater: ITheaterUpdate = {
        name: theaterData.name,
        mobile: theaterData.mobile,
        coords,
        address
      }
      theater.coords = coords
      this.theaterService.updatetheaterDetails(this.theaterId, theater).subscribe({
        next: (res) => {
          void this.router.navigate(['/theater/profile'])
          if (res.data != null) this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
        }
      })
    }
  }

  async autoFillAddress (): Promise<void> {
    const coords = await getLocation()
    if (coords !== null) {
      this.longitude = coords.lon
      this.latitude = coords.lat
      console.log(coords, 'coords from getLocation')
      this.locationService.getAddress(coords.lat, coords.lon).subscribe({
        next: (res) => {
          console.log(res, 'res from getAddress')
          this.profileForm.get('city')?.setValue(res.city)
          this.profileForm.get('district')?.setValue(res.district)
          this.profileForm.get('state')?.setValue(res.state)
          this.profileForm.get('country')?.setValue(res.country)
          this.profileForm.get('zip')?.setValue(String(res.zip))
        }
      })
    }
  }
}
