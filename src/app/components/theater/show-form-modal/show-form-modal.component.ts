/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common'
import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { Store, select } from '@ngrx/store'
import * as moment from 'moment'
import { Subject, debounceTime } from 'rxjs'
import { validateByTrimming } from 'src/app/helpers/validations'
import { ICSMovieRes, IDuration } from 'src/app/models/movie'
import { IScreen } from 'src/app/models/screens'
import { MovieService } from 'src/app/services/movie.service'
import { ScreenService } from 'src/app/services/screen.service'
import { defaultPriceValidators, requiredValidator } from 'src/app/shared/valiators'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { MovieSelectValidationComponent } from './validation/movie-select-validation/movie-select-validation.component'
import { DefPriceValidationComponent } from './validation/def-price-validation/def-price-validation.component'
import { ScreenSelectValidationComponent } from './validation/screen-select-validation/screen-select-validation.component'
import { ShowDateValidationComponent } from './validation/show-date-validation/show-date-validation.component'
import { StartTimeValidationComponent } from './validation/start-time-validation/start-time-validation.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    ReactiveFormsModule,

    // ? Validation Error Message Components
    MovieSelectValidationComponent,
    ScreenSelectValidationComponent,
    ShowDateValidationComponent,
    StartTimeValidationComponent,
    DefPriceValidationComponent
  ],
  selector: 'app-show-form-modal',
  templateUrl: './show-form-modal.component.html',
  styleUrls: ['./show-form-modal.component.css']
})
export class ShowFormModalComponent implements OnInit, OnDestroy {
  theaterData$ = this.store.pipe(select(selectTheaterDetails))
  searchSubject = new Subject<string>()
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

  showMovieOptions = false
  showMovieError = false
  selectedMovieId = ''

  onInputBlur (): void {
    setTimeout(() => {
      this.showMovieOptions = false
    }, 200)
  }

  onInputFocus (): void {
    setTimeout(() => {
      this.showMovieOptions = true
    }, 200)
  }

  onInputChange (event: any): void {
    const query = event.target.value as string
    this.searchSubject.next(query)
  }

  selectMovie (movie: ICSMovieRes): void {
    this.isMovieSelected = true
    this.showForm.controls['movie'].setValue(movie.title)
    this.showForm.controls['movie'].disable()
    this.showMovieOptions = false
    this.showMovieError = false
    this.selectedMovieId = movie._id
    this.movieDuration = movie.duration
    console.log(movie, 'selected movie')
    if (this.isStartTimeSelected) {
      this.calculateEndTime(this.startTimeStr, movie.duration)
    }
  }

  changeMovie (): void {
    console.log('allowing movie change')
    this.showForm.controls['movie'].enable()
    this.showMovieOptions = true
    this.isMovieSelected = false
    this.selectedMovieId = ''
    this.endingTime = ''
  }

  priceControls: Array<{ category: string, label: string, controlName: string }> = []

  constructor (
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder,
    @Inject(NgbActiveModal) public activeModal: NgbActiveModal,
    @Inject(MovieService) private readonly movieService: MovieService,
    @Inject(ScreenService) private readonly screenService: ScreenService,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.showForm = this.formBuilder.group({
      movie: ['', [validateByTrimming(requiredValidator)]],
      screenId: ['', [validateByTrimming(requiredValidator)]],
      startTime: ['', [validateByTrimming(requiredValidator)]],
      date: [this.currDate.toISOString().substring(0, 10), [validateByTrimming(requiredValidator)]]
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

    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(movieName => {
        this.movieService.searchMovie(movieName, false).subscribe((res) => {
          this.movies = res.data
        })
      })
  }

  onScreenChange (event: Event): void {
    console.log(event, 'event on screen change')
    const target = event.target as HTMLSelectElement
    const screenId = target.value

    this.screenService.getAvailSeatsOnScreen(screenId).subscribe({
      next: (res) => {
        if (res.data === null) return
        console.log(res.data, 'res from getAvailSEats on screen')
        this.showForm.removeControl('diamondPrice')
        this.showForm.removeControl('goldPrice')
        this.showForm.removeControl('silverPrice')
        this.priceControls = []
        for (const category in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, category)) {
            const priceControlName = `${category}Price`
            console.log(priceControlName, 'price control name')

            // Check if the control already exists to avoid duplicates
            if (this.showForm.get(priceControlName) == null) {
              this.showForm.addControl(priceControlName, this.formBuilder.control('', [validateByTrimming(defaultPriceValidators)]))
              this.priceControls.push({ category, label: res.data[category as keyof typeof res.data] as string, controlName: priceControlName })
            }
          }
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.searchSubject.unsubscribe()
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
    if (this.showForm.valid && this.selectedMovieId !== '') {
      const showFormData = this.showForm.value
      showFormData.movieId = this.selectedMovieId
      console.log(showFormData, 'show form data from modal')
      showFormData.startTime = this.convertTimeStrToDateObj(showFormData.startTime, new Date(showFormData.date))
      console.log(showFormData.startTime, 'start time from modal')
      this.activeModal.close(showFormData)
    } else if (this.selectedMovieId === '') {
      this.showMovieError = true
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
