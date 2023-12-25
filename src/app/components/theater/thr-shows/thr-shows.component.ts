import { Component, Inject, type OnInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store, select } from '@ngrx/store'
import { ShowService } from 'src/app/services/show.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { ShowFormModalComponent } from '../../common/show-form-modal/show-form-modal.component'
import { type IShowsOnAScreen } from 'src/app/models/show'
import { getGenre, getLanguage } from 'src/app/helpers/movie'
import { MovieService } from 'src/app/services/movie.service'

@Component({
  selector: 'app-thr-shows',
  templateUrl: './thr-shows.component.html',
  styleUrls: ['./thr-shows.component.css']
})
export class ThrShowsComponent implements OnInit {
  theaterData$ = this.store.pipe(select(selectTheaterDetails))
  theaterId = ''
  screens: IShowsOnAScreen[] = []
  currDate: Date = new Date()
  isLoading = true
  getGenre = getGenre
  getLanguage = getLanguage

  constructor (
    @Inject(ShowService) private readonly showService: ShowService,
    @Inject(MovieService) private readonly movieService: MovieService,
    @Inject(Store) private readonly store: Store,
    @Inject(NgbModal) private readonly modalService: NgbModal
  ) {}

  ngOnInit (): void {
    this.theaterData$.subscribe((theater) => {
      if (theater != null) {
        this.theaterId = theater._id
      }
    })

    this.onSelectDate(new Date())
  }

  addNewShow (): void {
    const modalRef = this.modalService.open(ShowFormModalComponent, { backdrop: 'static', centered: true })
    // You can pass data to the modal using modalRef.componentInstance.propertyName
    // For example: modalRef.componentInstance.myData = someData;

    // Access the component instance and set input values
    modalRef.componentInstance.modalTitle = 'Add Show'
    modalRef.componentInstance.submitBtn = 'Add'
    modalRef.componentInstance.currDate = this.currDate
    // modalRef.componentInstance.fields = yourFieldsArray

    void modalRef.result.then(
      (result) => {
        console.log('submitted form data', result)
        this.showService.addShow(result).subscribe({
          next: (res) => {
            if (res.data !== null) {
              const { seats, ...newShow } = res.data
              console.log(res.data, 'res from addShow')
              const { screenId, movieId } = res.data
              const screenIdx = this.screens.findIndex(screen => screen.screenId === screenId)
              const showIdx = this.screens[screenIdx].shows.findIndex(show => show.movieId._id === movieId)
              if (showIdx !== -1) {
                // if movie already exist on the day, just add new show details
                this.screens[screenIdx].shows[showIdx].shows.push(newShow)
              } else {
                // if movie don't exist in the screen on the day, get movie data and push
                this.movieService.findMovieById(movieId).subscribe({
                  next: (res) => {
                    const movie = res.data
                    this.screens[screenIdx].shows.push({
                      movieId: movie,
                      shows: [newShow]
                    })
                  }
                })
              }
            }
          }
        })
      },
      (reason) => {
        // Handle dismissal or any other reason
        console.log('Modal dismissed with reason:', reason)
      }
    )
  }

  onSelectDate (date: Date): void {
    this.isLoading = true
    this.currDate = date
    console.log(date.toISOString().split('T')[0], 'date selected from onSelectDate')
    const formattedDate = date.toISOString().split('T')[0]
    this.showService.findShowsOnDateForTheater(this.theaterId, formattedDate).subscribe({
      next: (res) => {
        this.isLoading = false
        console.log(res.data, 'res.data from show service')
        if (res.data !== null) this.screens = res.data
      },
      error: () => {
        this.isLoading = false
      }
    })
  }
}
