import { Component, Inject, type OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { type IApiScreensRes, type IScreen } from 'src/app/models/screens'
import { ScreenService } from 'src/app/services/screen.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import Swal from 'sweetalert2'

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
    @Inject(Router) private readonly router: Router
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
