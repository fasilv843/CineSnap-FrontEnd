/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, inject } from '@angular/core'

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
  private readonly activeModal = inject(ActiveModal)

  onDismiss (reason: string): void {
    this.activeModal.dismiss(reason)
  }

  onClose (str: string): void {
    this.activeModal.close(str)
  }
}
