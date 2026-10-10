/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy } from '@angular/core'

// import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { ActiveModal } from 'src/app/services/modal.service'
// import { Store } from '@ngrx/store'

@Component({
    selector: 'app-thr-offcanvas',
    imports: [],
    templateUrl: './thr-offcanvas.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./thr-offcanvas.component.css']
})
export class ThrOffcanvasComponent {
  // theaterDetails$ = this._store.select(selectTheaterDetails)
  // isLoggedIn = false

  constructor (
    private readonly activeModal: ActiveModal
    // private readonly _store: Store,
  ) {}

  onDismiss (reason: string): void {
    this.activeModal.dismiss(reason)
  }

  onClose (str: string): void {
    this.activeModal.close(str)
  }
}
