/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { Store, select } from '@ngrx/store'
import * as moment from 'moment'
import { validateByTrimming } from 'src/app/helpers/validations'
import { ICSMovieRes, IDuration } from 'src/app/models/movie'
import { IScreen } from 'src/app/models/screens'
import { ValidationModule } from 'src/app/modules/validation/validation.module'
import { MovieService } from 'src/app/services/movie.service'
import { ScreenService } from 'src/app/services/screen.service'
import { defaultPriceValidators, requiredValidator } from 'src/app/shared/valiators'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    ReactiveFormsModule,
    ValidationModule
  ],
  selector: 'app-show-form-modal',
  templateUrl: './show-form-modal.component.html',
  styleUrls: ['./show-form-modal.component.css']
})
export class ShowFormModalComponent implements OnInit {
  theaterData$ = this.store.pipe(select(selectTheaterDetails))
  showForm!: FormGroup
  isSubmitted = false
  movies: ICSMovieRes[] = []
  screens: IScreen[] = []
  theaterId: string = ''

  modalTitle: string = ''
  submitBtn: string = ''

  isMovieSelected = false
  movieDuration!: IDuration
  isStartTimeSelected = false
  startTimeStr = '00:00'
  endingTime: string = '00:00'
  currDate: Date = new Date()

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(NgbActiveModal) public activeModal: NgbActiveModal,
    @Inject(MovieService) private readonly movieService: MovieService,
    @Inject(ScreenService) private readonly screenService: ScreenService,
    @Inject(Store) private readonly store: Store
  ) {

  }

  ngOnInit (): void {
    this.showForm = this.formBuilder.group({
      movieId: ['', [validateByTrimming(requiredValidator)]],
      screenId: ['', [validateByTrimming(requiredValidator)]],
      startTime: ['', [validateByTrimming(requiredValidator)]],
      date: [this.currDate.toISOString().substring(0, 10), [validateByTrimming(requiredValidator)]],
      ticketPrice: ['', [validateByTrimming(defaultPriceValidators)]]
    })

    this.theaterData$.subscribe(theater => {
      if (theater !== null) this.theaterId = theater._id
    })

    this.movieService.findAllMovies().subscribe({
      next: (res) => {
        this.movies = res.data
      }
    })

    this.screenService.findScreens(this.theaterId).subscribe({
      next: (res) => {
        if (res.data === null) return
        this.screens = res.data
      }
    })
  }

  onMovieSelect (): void {
    // Access value of the form control named 'movie'
    this.isMovieSelected = true
    const movieId = this.showForm.get('movieId')?.value
    const movie = this.movies.find(movie => movie._id === movieId)
    if (movie != null) {
      this.movieDuration = movie.duration
      console.log(movie, 'selected movie')
      if (this.isStartTimeSelected) {
        this.calculateEndTime(this.startTimeStr, movie.duration)
      }
    }
  }

  onStartTimeChange (event: any): void {
    const startingTimeString = event.target.value
    this.startTimeStr = startingTimeString
    this.isStartTimeSelected = true
    console.log(this.isMovieSelected, this.movieDuration, 'ismovieselected, movieduration')
    if (this.isMovieSelected && this.movieDuration !== null) {
      console.log(startingTimeString, 'startingTime str')
      this.calculateEndTime(startingTimeString, this.movieDuration)
      console.log(this.endingTime, 'ending time')
    }
  }

  calculateEndTime (startingTimeString: string, duration: IDuration): void {
    const startingTimeMoment = moment(startingTimeString, 'HH:mm') // Parse starting time with format
    console.log(startingTimeMoment, 'moment')
    // console.log(startingTimeMoment.valueOf(), 'moment valueof')
    const totalDurationMinutes = duration.hours * 60 + duration.minutes
    const endingTimeMoment = startingTimeMoment.add(totalDurationMinutes, 'minutes') // Add duration to starting time
    this.endingTime = endingTimeMoment.format('LT') // Format ending time with desired format
  }

  setData (data: any): void {
    this.showForm.patchValue(data)
  }

  onSubmit (): void {
    this.isSubmitted = true
    if (this.showForm.valid) {
      const showFormData = this.showForm.value
      console.log(showFormData, 'show form data from modal')
      showFormData.startTime = this.convertTimeStrToDateObj(showFormData.startTime, new Date(showFormData.date))
      console.log(showFormData.startTime, 'start time from modal')
      this.activeModal.close(showFormData)
    } else {
      console.log('showForm is invalid', this.showForm.controls)
    }
  }

  convertTimeStrToDateObj (timeStr: string, date: Date): Date {
    // Set the hours and minutes from the time string
    console.log(timeStr, 'tiemStr from convert funcion')
    date.setHours(parseInt(timeStr.split(':')[0]), parseInt(timeStr.split(':')[1]))

    // Clear seconds, milliseconds for cleaner representation
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
  }

  onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
