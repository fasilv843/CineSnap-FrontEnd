import { Component, Inject, type OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store, select } from '@ngrx/store'
import { type IApiScreensRes, type IScreen } from 'src/app/models/screens'
import { ScreenService } from 'src/app/services/screen.service'
// import { screenFields } from 'src/app/shared/validationFields/screenFields'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import Swal from 'sweetalert2'
// import { DynamicFormModalComponent } from '../../common/dynamic-form-modal/dynamic-form-modal.component'

@Component({
  selector: 'app-thr-screens',
  templateUrl: './thr-screens.component.html',
  styleUrls: ['./thr-screens.component.css']
})
export class ThrScreensComponent implements OnInit {
  screens: IScreen[] = []
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  theaterId: string = ''

  constructor (
    @Inject(ScreenService) private readonly screenService: ScreenService,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(NgbModal) private readonly modalService: NgbModal
  ) {}

  ngOnInit (): void {
    this.theaterDetails$.subscribe({
      next: (theater) => {
        this.theaterId = theater?._id as string
      }
    })

    this.screenService.findScreens(this.theaterId).subscribe({
      next: (res: IApiScreensRes) => {
        console.log(res.data)
        this.screens = res.data
      }
    })
  }

  // openAddScreenModal (): void {
  //   const modalRef = this.modalService.open(DynamicFormModalComponent, { backdrop: 'static', centered: true })
  //   // Access the component instance and set input values
  //   modalRef.componentInstance.modalTitle = 'Add New Screen'
  //   modalRef.componentInstance.submitBtn = 'Add'
  //   modalRef.componentInstance.fields = screenFields
  //   // modalRef.componentInstance.fields = yourFieldsArray

  //   void modalRef.result.then(
  //     (result) => {
  //       console.log('submitted form data', result)
  //     },
  //     (reason) => {
  //       // Handle dismissal or any other reason
  //       console.log('Modal dismissed with reason:', reason)
  //     }
  //   )
  // }

  viewScreen (screenId: string): void {
    void this.router.navigate(['/theater/screens', screenId])
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

  editScreen (screenId: string): void {
    void this.router.navigate(['/theater/screens/edit', screenId])
  }
}
