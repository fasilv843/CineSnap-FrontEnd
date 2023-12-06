import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { type IApiScreensRes, type IScreen } from 'src/app/models/screens'
import { type IApiTheaterRes, type ITheaterRes } from 'src/app/models/theater'
import { ScreenService } from 'src/app/services/screen.service'
import { TheaterService } from 'src/app/services/theater.service'

@Component({
  selector: 'app-theater-page',
  templateUrl: './theater-page.component.html',
  styleUrls: ['./theater-page.component.css']
})
export class TheaterPageComponent implements OnInit {
  theaterId = ''
  theater!: ITheaterRes
  screens: IScreen[] = []

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(ScreenService) private readonly screenService: ScreenService,
    @Inject(TheaterService) private readonly theaterService: TheaterService
  ) {}

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.theaterId = params['theaterId']
    })

    this.theaterService.getTheaterData(this.theaterId).subscribe({
      next: (res: IApiTheaterRes) => {
        this.theater = res.data
      }
    })

    this.screenService.findScreens(this.theaterId).subscribe({
      next: (res: IApiScreensRes) => {
        console.log(res.data)
        this.screens = res.data
      }
    })
  }

  onSelectDate (date: Date): void {
    console.log(date, 'date selected from onSelectDate')
  }
}
