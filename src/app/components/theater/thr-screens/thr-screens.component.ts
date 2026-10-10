import { Component, type OnInit, ChangeDetectionStrategy, inject } from '@angular/core'
import { Router } from '@angular/router'
import { ModalService } from 'src/app/services/modal.service'
import { Store } from '@ngrx/store'
import { type IScreenRequirements, type IApiScreensRes, type IScreen } from 'src/app/models/screens'
import { ScreenService } from 'src/app/services/screen.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import Swal from 'sweetalert2'
import { ScreenFormModalComponent } from '../screen-form-modal/screen-form-modal.component'
import { ThrNavComponent } from '../thr-nav/thr-nav.component';

@Component({
    selector: 'app-thr-screens',
    templateUrl: './thr-screens.component.html',
    styleUrls: ['./thr-screens.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThrNavComponent]
})
export class ThrScreensComponent implements OnInit {
  private readonly screenService = inject(ScreenService)
  private readonly store = inject(Store)
  private readonly router = inject(Router)
  private readonly modalService = inject(ModalService)

  screens: IScreen[] = []
  theaterDetails = this.store.selectSignal(selectTheaterDetails)
  theaterId: string = ''

  ngOnInit (): void {
    this.theaterId = this.theaterDetails()?._id as string

    this.screenService.findScreens(this.theaterId).subscribe({
      next: (res: IApiScreensRes) => {
        if (res.data === null) return
        console.log(res.data)
        this.screens = res.data
      }
    })
  }

  addNewScreen (): void {
    const modalRef = this.modalService.open(ScreenFormModalComponent, { static: true })

    modalRef.componentInstance.modalTitle = 'Add Screen'
    modalRef.componentInstance.submitBtn = 'Add'

    void modalRef.result.then(
      (result: IScreenRequirements) => {
        result.theaterId = this.theaterId
        console.log('submitted form data', result)
        this.screenService.addScreen(result).subscribe({
          next: (res) => {
            if (res.data === null) return
            console.log(res.data, 'res.data from saving screen')
            void this.router.navigate(['/theater/screens/seat', res.data.seatId])
          }
        })
      },
      (reason) => {
        // Handle dismissal or any other reason
        console.log('Modal dismissed with reason:', reason)
      }
    )
  }

  viewScreen (screenSeatId: string): void {
    void this.router.navigate(['/theater/screens/seat', screenSeatId])
  }

  deleteScreen (screenId: string): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Delete this screen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.screenService.deleteScreen(screenId).subscribe({
          next: (res) => {
            void Swal.fire('Deleted', 'Screen Successfully Deleted', 'success')
            this.screens = this.screens.filter(s => s._id !== screenId)
          }
        })
      }
    })
  }

  // updateScreenName (screenId: string, screenName: string): void {
  //   this.screenService.updateScreenName(screenId, screenName).subscribe({})
  // }
}
