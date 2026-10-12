import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core'
import { FormField, form } from '@angular/forms/signals'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { dateToString } from 'src/app/shared/utils/date'
import { getLocation } from 'src/app/shared/utils/location'
import { type ICoords } from 'src/app/core/models/api.model'
import { type IUserUpdate } from 'src/app/core/models/user.model'
import { GeoLocationRepo } from 'src/app/shared/repos/geo-location.repo'
import { UserAccountRepo } from 'src/app/user/repos/account.repo'
import { imagesFolderPath } from 'src/app/core/constants/constants'
import { dobRules, mobileRules, nameRules, requiredText, zipRules } from 'src/app/shared/utils/form-rules'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { selectCoords } from 'src/app/core/state/coords/coords.selector'
import { saveUserOnStore } from 'src/app/core/state/user/user.actions'
import { selectUserDetails } from 'src/app/core/state/user/user.selector'
import { PhotoPickerComponent } from 'src/app/shared/ui/photo-picker.component'
import { UserNavComponent } from '../../layout/user-nav/user-nav.component'

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, PhotoPickerComponent, FormField, RouterLink, ButtonDirective, FieldErrorComponent]
})
export class UserEditProfileComponent {
  private readonly accountRepo = inject(UserAccountRepo)
  private readonly geoLocation = inject(GeoLocationRepo)
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  protected readonly user = this.store.selectSignal(selectUserDetails)
  private readonly browserCoords = this.store.selectSignal(selectCoords)

  private readonly model = signal({ name: '', mobile: '', dob: '', city: '', district: '', state: '', country: '', zip: '' })
  protected readonly form = form(this.model, p => {
    nameRules(p.name)
    mobileRules(p.mobile)
    dobRules(p.dob)
    requiredText(p.city)
    requiredText(p.district)
    requiredText(p.state)
    requiredText(p.country)
    zipRules(p.zip)
  })


  protected readonly submitted = signal(false)
  protected readonly formInvalid = computed(() => this.form().invalid())
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
        this.model.set({
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
        this.model.update(value => ({
          ...value,
          city: address.city ?? '',
          district: address.district ?? '',
          state: address.state ?? '',
          country: address.country ?? '',
          zip: address.zip !== undefined ? String(address.zip) : ''
        }))
        this.locating.set('idle')
      },
      error: () => { this.locating.set('failed') }
    })
  }

  protected save (): void {
    this.submitted.set(true)
    const user = this.user()
    if (this.form().invalid() || user === null) return

    const value = this.model()
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
    this.accountRepo.updateUserDetails(user._id, update).subscribe({
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
    this.accountRepo.updateUserProfile(user._id, formData).subscribe({
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
    this.accountRepo.deleteUserProfile(user._id).subscribe({
      next: res => {
        this.photoBusy.set(false)
        if (res.data !== null) this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
      },
      error: () => { this.photoBusy.set(false) }
    })
  }
}
