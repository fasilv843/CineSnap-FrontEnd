import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core'
import { FormField, form } from '@angular/forms/signals'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { type Observable, catchError, map, of, switchMap } from 'rxjs'
import { getLocation } from 'src/app/shared/utils/location'
import { type ICoords } from 'src/app/core/models/api.model'
import { type ITheaterRes, type ITheaterUpdate } from 'src/app/core/models/theater.model'
import { GeoLocationRepo } from 'src/app/shared/repos/geo-location.repo'
import { TheaterAccountRepo } from 'src/app/theater/repos/account.repo'
import { imagesFolderPath } from 'src/app/core/constants/constants'
import { mobileRules, nameRules, requiredText, zipRules } from 'src/app/shared/utils/form-rules'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { IconComponent } from 'src/app/shared/ui/icon.component'
import { PhotoPickerComponent } from 'src/app/shared/ui/photo-picker.component'
import { ToastService } from 'src/app/core/toast/toast.service'
import { saveTheaterOnStore } from 'src/app/core/state/theater/theater.action'
import { selectTheaterDetails } from 'src/app/core/state/theater/theater.selector'

const ADDRESS_FIELDS = ['city', 'district', 'state', 'country', 'zip'] as const

@Component({
  selector: 'app-edit-theater-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink, ButtonDirective, FieldErrorComponent, IconComponent, PhotoPickerComponent]
})
export class TheaterEditProfileComponent {
  private readonly accountRepo = inject(TheaterAccountRepo)
  private readonly geo = inject(GeoLocationRepo)
  private readonly store = inject(Store)
  private readonly router = inject(Router)
  private readonly toast = inject(ToastService)

  protected readonly theater = this.store.selectSignal(selectTheaterDetails)

  private readonly model = signal({ name: '', mobile: '', landmark: '', city: '', district: '', state: '', country: '', zip: '' })
  protected readonly form = form(this.model, p => {
    nameRules(p.name, 'Enter the theater name')
    mobileRules(p.mobile)
    requiredText(p.city)
    requiredText(p.district)
    requiredText(p.state)
    requiredText(p.country)
    zipRules(p.zip, 'Enter the PIN code')
  })


  protected readonly submitted = signal(false)
  protected readonly formInvalid = computed(() => this.form().invalid())
  protected readonly saving = signal(false)
  protected readonly photoBusy = signal(false)
  protected readonly locating = signal<'idle' | 'busy' | 'failed'>('idle')
  private readonly pickedCoords = signal<ICoords | null>(null)

  protected readonly photoUrl = computed(() => {
    const pic = this.theater()?.profilePic
    return pic !== undefined && pic !== '' ? imagesFolderPath + pic : null
  })

  constructor () {
    // Fill the form once, so later store updates (e.g. a new photo) don't wipe edits
    let filled = false
    effect(() => {
      const theater = this.theater()
      if (theater === null || filled) return
      filled = true
      untracked(() => {
        this.model.set({
          name: theater.name,
          mobile: theater.mobile !== undefined && theater.mobile !== 0 ? String(theater.mobile) : '',
          landmark: theater.address?.landmark ?? '',
          city: theater.address?.city ?? '',
          district: theater.address?.district ?? '',
          state: theater.address?.state ?? '',
          country: theater.address?.country ?? '',
          zip: theater.address?.zip !== undefined ? String(theater.address.zip) : ''
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
    this.pickedCoords.set({ type: 'Point', coordinates: [position.lon, position.lat] })
    this.geo.getAddress(position.lat, position.lon).subscribe({
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
    const theater = this.theater()
    if (this.form().invalid() || theater === null) return

    const value = this.model()
    this.saving.set(true)
    // Wait for the coordinates before saving, so the map pin matches the address
    this.resolveCoords(theater).pipe(
      switchMap(coords => {
        const update: ITheaterUpdate = {
          name: value.name.trim(),
          mobile: value.mobile.trim() !== '' ? Number(value.mobile) : undefined,
          coords,
          address: {
            landmark: value.landmark.trim(),
            city: value.city.trim(),
            district: value.district.trim(),
            state: value.state.trim(),
            country: value.country.trim(),
            zip: Number(value.zip)
          }
        }
        return this.accountRepo.updatetheaterDetails(theater._id, update)
      })
    ).subscribe({
      next: res => {
        if (res.data != null) this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
        this.toast.success('Profile saved')
        void this.router.navigate(['/theater/profile'])
      },
      error: () => { this.saving.set(false) }
    })
  }

  /** Picked location, else a fresh lookup when the address changed, else the saved coordinates */
  private resolveCoords (theater: ITheaterRes): Observable<ICoords> {
    const picked = this.pickedCoords()
    if (picked !== null) return of(picked)
    const value = this.model()
    const changed = ADDRESS_FIELDS.some(field => String(theater.address?.[field] ?? '') !== value[field].trim())
    if (!changed) return of(theater.coords)
    return this.geo.getCoords(value.city.trim(), value.country.trim(), Number(value.zip)).pipe(
      map(found => ({ type: 'Point', coordinates: found.coordinates })),
      catchError(() => of(theater.coords))
    )
  }

  // Photo ----------------------------------------------------------------------

  protected uploadPhoto (image: Blob): void {
    const theater = this.theater()
    if (theater === null) return
    const formData = new FormData()
    formData.append('image', image, `${theater.name}.jpg`)
    this.photoBusy.set(true)
    this.accountRepo.updateTheaterProfilePic(theater._id, formData).subscribe({
      next: res => {
        this.photoBusy.set(false)
        if (res.data != null) this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
      },
      error: () => { this.photoBusy.set(false) }
    })
  }

  protected removePhoto (): void {
    const theater = this.theater()
    if (theater === null) return
    this.photoBusy.set(true)
    this.accountRepo.deleteTheaterProfilePic(theater._id).subscribe({
      next: res => {
        this.photoBusy.set(false)
        if (res.data != null) this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
      },
      error: () => { this.photoBusy.set(false) }
    })
  }
}
