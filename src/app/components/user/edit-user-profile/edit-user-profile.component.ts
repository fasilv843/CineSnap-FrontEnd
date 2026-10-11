import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { map } from 'rxjs'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { dateToString } from 'src/app/helpers/date'
import { getLocation } from 'src/app/helpers/location'
import { validateByTrimming, validateDOB } from 'src/app/helpers/validations'
import { type ICoords } from 'src/app/models/common'
import { type IUserUpdate } from 'src/app/models/users'
import { GeoLocationService } from 'src/app/services/geo-location.service'
import { UserService } from 'src/app/services/user.service'
import { MinAge, imagesFolderPath, userNameMaxLength, userNameMinLength } from 'src/app/shared/constants'
import { mobileValidators, nameValidators, requiredValidator, zipValidators } from 'src/app/shared/valiators'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { selectCoords } from 'src/app/states/coords/coords.selector'
import { saveUserOnStore } from 'src/app/states/user/user.actions'
import { selectUserDetails } from 'src/app/states/user/user.selector'
import { PhotoPickerComponent } from 'src/app/shared/ui/photo-picker.component'
import { UserNavComponent } from '../user-nav/user-nav.component'

function text (validators = requiredValidator): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: [validateByTrimming(validators)] })
}

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, PhotoPickerComponent, ReactiveFormsModule, RouterLink, ButtonDirective, FieldErrorComponent]
})
export class EditUserProfileComponent {
  private readonly userService = inject(UserService)
  private readonly geoLocation = inject(GeoLocationService)
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  protected readonly user = this.store.selectSignal(selectUserDetails)
  private readonly browserCoords = this.store.selectSignal(selectCoords)

  protected readonly form = new FormGroup({
    name: text(nameValidators),
    mobile: new FormControl('', { nonNullable: true, validators: [validateByTrimming(mobileValidators)] }),
    dob: new FormControl('', { nonNullable: true }),
    city: text(),
    district: text(),
    state: text(),
    country: text(),
    zip: text(zipValidators)
  }, { validators: validateDOB })

  protected readonly messages = {
    name: {
      required: 'Enter your name',
      minlength: `Use at least ${userNameMinLength} letters`,
      maxlength: `Use at most ${userNameMaxLength} letters`,
      pattern: 'Use letters and spaces only'
    },
    mobile: { pattern: 'Enter a 10-digit mobile number' },
    dob: { minAge: `You need to be at least ${MinAge} years old`, minDate: 'Choose a date after 1960' },
    zip: { required: 'Enter your PIN code', pattern: 'Enter a 6-digit PIN code' },
    required: { required: 'This field is required' }
  }

  protected readonly submitted = signal(false)
  protected readonly formInvalid = toSignal(this.form.statusChanges.pipe(map(status => status === 'INVALID')), { initialValue: this.form.invalid })
  protected readonly saving = signal(false)
  protected readonly locating = signal<'idle' | 'busy' | 'failed'>('idle')

  // Coordinates saved with the address: the profile's own, replaced when "Use my current location" runs
  private readonly pickedCoords = signal<ICoords | null>(null)
  private readonly coords = computed(() => this.pickedCoords() ?? this.user()?.coords ?? this.browserCoords() ?? undefined)

  protected readonly photoUrl = computed(() => {
    const pic = this.user()?.profilePic
    return pic !== undefined && pic !== '' ? imagesFolderPath + pic : ''
  })

  constructor () {
    // Fill the form once, when the user is first available, so later store updates (e.g. a new photo) don't wipe edits
    let filled = false
    effect(() => {
      const user = this.user()
      if (user === null || filled) return
      filled = true
      untracked(() => {
        this.form.patchValue({
          name: user.name,
          mobile: user.mobile !== undefined && user.mobile !== null ? String(user.mobile) : '',
          dob: user.dob !== undefined ? dateToString(new Date(user.dob)) : '',
          city: user.address?.city ?? '',
          district: user.address?.district ?? '',
          state: user.address?.state ?? '',
          country: user.address?.country ?? '',
          zip: user.address?.zip !== undefined ? String(user.address.zip) : ''
        })
      })
    })
  }

  protected async useCurrentLocation (): Promise<void> {
    this.locating.set('busy')
    const position = await getLocation()
    if (position === null) {
      this.locating.set('failed')
      return
    }
    this.pickedCoords.set({ coordinates: [position.lon, position.lat] })
    this.geoLocation.getAddress(position.lat, position.lon).subscribe({
      next: address => {
        this.form.patchValue({
          city: address.city ?? '',
          district: address.district ?? '',
          state: address.state ?? '',
          country: address.country ?? '',
          zip: address.zip !== undefined ? String(address.zip) : ''
        })
        this.locating.set('idle')
      },
      error: () => { this.locating.set('failed') }
    })
  }

  protected save (): void {
    this.submitted.set(true)
    const user = this.user()
    if (this.form.invalid || user === null) return

    const value = this.form.getRawValue()
    const update: IUserUpdate = {
      name: value.name.trim(),
      mobile: value.mobile.trim() !== '' ? Number(value.mobile) : undefined,
      dob: new Date(value.dob),
      coords: this.coords(),
      address: {
        city: value.city.trim(),
        district: value.district.trim(),
        state: value.state.trim(),
        country: value.country.trim(),
        zip: Number(value.zip)
      }
    }

    this.saving.set(true)
    this.userService.updateUserDetails(user._id, update).subscribe({
      next: res => {
        if (res.data !== null) this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
        void this.router.navigate(['/user/profile'])
      },
      error: () => { this.saving.set(false) }
    })
  }

  // Photo ----------------------------------------------------------------------

  protected readonly photoBusy = signal(false)

  protected uploadPhoto (image: Blob): void {
    const user = this.user()
    if (user === null) return
    const formData = new FormData()
    formData.append('image', image, `${user.name}.jpg`)
    this.photoBusy.set(true)
    this.userService.updateUserProfile(user._id, formData).subscribe({
      next: res => {
        this.photoBusy.set(false)
        if (res.data !== null) this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
      },
      error: () => { this.photoBusy.set(false) }
    })
  }

  protected removePhoto (): void {
    const user = this.user()
    if (user === null) return
    this.photoBusy.set(true)
    this.userService.deleteUserProfile(user._id).subscribe({
      next: res => {
        this.photoBusy.set(false)
        if (res.data !== null) this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
      },
      error: () => { this.photoBusy.set(false) }
    })
  }
}
