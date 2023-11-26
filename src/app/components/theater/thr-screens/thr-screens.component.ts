import { Component, Inject, type OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { type IApiScreensRes, type IScreen } from 'src/app/models/screens'
import { ScreenService } from 'src/app/services/screen.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

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
    @Inject(Store) private readonly store: Store
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

  deleteScreen (): void {
    console.log('delete screen')
  }

  editScreen (): void {
    console.log(' edit screen')
  }
}
