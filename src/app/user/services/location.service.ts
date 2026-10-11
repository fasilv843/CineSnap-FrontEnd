import { Injectable, inject, signal } from '@angular/core'
import { Store } from '@ngrx/store'
import { saveCoords } from 'src/app/core/state/coords/coords.actions'

export type LocationStatus = 'idle' | 'pending' | 'granted' | 'denied' | 'unsupported'

/** Asks the browser for the user's position once per session and saves it in the coords store slice. */
@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly store = inject(Store)

  readonly status = signal<LocationStatus>('idle')

  request (): void {
    if (this.status() !== 'idle' && this.status() !== 'denied') return
    if (!('geolocation' in navigator)) {
      this.status.set('unsupported')
      return
    }
    this.status.set('pending')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.store.dispatch(saveCoords({ coords: { coordinates: [coords.longitude, coords.latitude] } }))
        this.status.set('granted')
      },
      () => { this.status.set('denied') }
    )
  }
}
