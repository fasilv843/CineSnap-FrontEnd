import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { getGenre, getLanguage } from 'src/app/helpers/movie'
import { type IShow, type IShowsOnAScreen } from 'src/app/models/show'
import { type IApiTheaterRes, type ITheaterRes } from 'src/app/models/theater'
import { ShowService } from 'src/app/services/show.service'
import { TheaterService } from 'src/app/services/theater.service'
import { imagesFolderPath } from 'src/app/shared/constants'

@Component({
  selector: 'app-theater-page',
  templateUrl: './theater-page.component.html',
  styleUrls: ['./theater-page.component.css']
})
export class TheaterPageComponent implements OnInit {
  theaterId = ''
  theater!: ITheaterRes
  screens: IShowsOnAScreen[] = []
  currDate: Date = new Date()
  prevDate: Date = this.currDate

  getGenre = getGenre
  getLanguage = getLanguage
  isShowLoading = true
  imagesFolderPath = imagesFolderPath

  // Commented template codes that may cause error, until add show complete

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(ShowService) private readonly showService: ShowService,
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

    this.onSelectDate(new Date())
  }

  onSelectDate (date: Date): void {
    this.isShowLoading = true
    this.currDate = date
    console.log(date.toISOString().split('T')[0], 'date selected from onSelectDate')
    const formattedDate = date.toISOString().split('T')[0]
    this.showService.findShowsOnDate(this.theaterId, formattedDate).subscribe({
      next: (res) => {
        this.isShowLoading = false
        this.prevDate = this.currDate
        console.log(res.data, 'res.data from show service')
        if (res.data !== null) this.screens = res.data
      },
      error: () => {
        this.isShowLoading = false
        this.currDate = this.prevDate
      }
    })
  }

  getTextColor (show: Omit<IShow, 'seatId'>): string {
    const percentatge = show.availableSeatCount / show.totalSeatCount

    if (percentatge >= 0.5) return 'text-green-500'
    else if (percentatge >= 0.7) return 'text-yellow-500'
    else return 'text-red-500'
  }

  // Assuming you have a property screens in your component
  hasShows (): boolean {
    return this.screens.some(screen => screen.shows.length > 0)
  }
}
