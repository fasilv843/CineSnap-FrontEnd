import { Component, Inject, type OnInit } from '@angular/core'
import { FormBuilder, type FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { dateToString } from 'src/app/helpers/date'
import { getLocation } from 'src/app/helpers/location'
// import { parseJwt } from 'src/app/helpers/jwt-token'
import { validateByTrimming, validateDOB } from 'src/app/helpers/validations'
import { type ICoords, type IUserAddress } from 'src/app/models/common'
import { type IUserUpdate, type IUserRes } from 'src/app/models/users'
import { GeoLocationService } from 'src/app/services/geo-location.service'
import { UserService } from 'src/app/services/user.service'
import { mobileValidators, nameValidators, requiredValidator, zipValidators } from 'src/app/shared/valiators'
import { saveUserOnStore } from 'src/app/states/user/user.actions'
// import { saveUserOnStore } from 'src/app/states/user/user.actions'
import { selectUserDetails } from 'src/app/states/user/user.selector'
// import { MatToolbarModule } from '@angular/material/toolbar'

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit {
  userDetails$ = this.store.pipe(select(selectUserDetails))
  user: IUserRes | null = null
  userId = ''
  profileForm!: FormGroup
  isSubmitted = false
  addressUpdateMode = true
  city = ''
  district = ''
  state = ''
  country = ''
  zip = ''
  longitude!: number
  latitude!: number

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(GeoLocationService) private readonly locationService: GeoLocationService
  ) {}

  ngOnInit (): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [validateByTrimming(nameValidators)]],
      mobile: ['', [validateByTrimming(mobileValidators)]],
      dob: [''],
      city: ['', [validateByTrimming(requiredValidator)]],
      district: ['', [validateByTrimming(requiredValidator)]],
      state: ['', [validateByTrimming(requiredValidator)]],
      country: ['', [validateByTrimming(requiredValidator)]],
      zip: ['', [validateByTrimming(zipValidators)]]
    }, {
      validators: validateDOB
    })

    this.userDetails$.subscribe(user => {
      this.user = user ?? this.user
      if (this.user !== null && this.user !== undefined) {
        this.userId = this.user._id
        this.profileForm.get('name')?.setValue(this.user.name)
        this.profileForm.get('mobile')?.setValue((this.user.mobile != null) ? String(this.user.mobile) : '')
        this.profileForm.get('dob')?.patchValue(dateToString(new Date(this.user.dob)))
        if (this.user.address != null) {
          this.city = this.user.address.city
          this.district = this.user.address.district
          this.state = this.user.address.state
          this.country = this.user.address.country
          this.zip = String(this.user.address.zip)
        }
      }
    })

    // if (this.user === null) {
    //   const userToken = localStorage.getItem('userToken')
    //   if (userToken === null) {
    //     console.log('login again, token not available')
    //     // code to logout
    //   } else {
    //     const tokenData = parseJwt(userToken)
    //     console.log(tokenData, 'tokenData that got from parseJwt')
    //     this.userService.getUserDetails(tokenData.id).subscribe({
    //       next: (res) => {
    //         if (res.data !== null) this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
    //       }
    //     })
    //   }
    // }
  }

  onSubmit (): void {
    this.isSubmitted = true
    if (this.profileForm.valid) {
      const userData = this.profileForm.getRawValue()
      const coords: ICoords = { coordinates: [this.longitude, this.latitude] }
      const address: IUserAddress = {
        city: userData.city,
        district: userData.district,
        state: userData.state,
        country: userData.country,
        zip: userData.zip
      }
      const user: IUserUpdate = {
        name: userData.name,
        mobile: userData.mobile,
        dob: userData.dob,
        coords,
        address
      }
      user.coords = coords
      this.userService.updateUserDetails(this.userId, user).subscribe({
        next: (res) => {
          void this.router.navigate(['/user/profile'])
          if (res.data != null) this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
        }
      })
    }
  }

  imageReady (event: any): void {
    console.log(event, 'image ready event in edit user profile')
  }

  deleteProfilePic (): void {

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
          this.country = res.country
          this.state = res.state
          this.district = res.district
          this.city = res.city
          this.zip = String(res.zip)
        }
      })
    }
  }

  updateAddress (): void {
    this.addressUpdateMode = !this.addressUpdateMode
  }
}
