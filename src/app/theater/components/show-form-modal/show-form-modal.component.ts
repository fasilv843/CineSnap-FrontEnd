import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core'
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Store } from '@ngrx/store'
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs'
import { dateToString } from 'src/app/shared/utils/date'
import { validateByTrimming } from 'src/app/shared/utils/custom-validators'
import { type ICSMovieRes } from 'src/app/core/models/movie.model'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { TheaterMovieRepo } from 'src/app/theater/repos/movie.repo'
import { TheaterScreenRepo } from 'src/app/theater/repos/screen.repo'
import { MAX_TICKET_PRICE, MIN_TICKET_PRICE } from 'src/app/core/constants/constants'
import { defaultPriceValidators, requiredValidator } from 'src/app/shared/utils/form-validators'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'
import { selectTheaterDetails } from 'src/app/core/state/theater/theater.selector'
import { valueOf } from 'src/app/shared/utils/resource'

type Category = 'diamond' | 'gold' | 'silver'
const CATEGORIES: Category[] = ['diamond', 'gold', 'silver']

export interface ShowFormResult {
  movieId: string
  screenId: string
  date: string
  startTime: Date
  diamondPrice?: number
  goldPrice?: number
  silverPrice?: number
}

/** Schedules a show. Set `date` (YYYY-MM-DD) before it renders; closes with a ShowFormResult. */
@Component({
  selector: 'app-show-form-modal',
  templateUrl: './show-form-modal.component.html',
  styleUrl: './show-form-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, ButtonDirective, FieldErrorComponent]
})
export class ShowFormModalComponent {
  protected readonly modal = inject(ActiveModal)
  private readonly movieRepo = inject(TheaterMovieRepo)
  private readonly screenRepo = inject(TheaterScreenRepo)
  private readonly theater = inject(Store).selectSignal(selectTheaterDetails)

  /** Day the form opens on */
  readonly date = signal(dateToString(new Date()))
  protected readonly today = dateToString(new Date())

  protected readonly form = new FormGroup({
    screenId: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    date: new FormControl(this.today, { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    startTime: new FormControl('', { nonNullable: true, validators: [validateByTrimming(requiredValidator)] }),
    diamondPrice: new FormControl({ value: '', disabled: true }, { nonNullable: true, validators: [validateByTrimming(defaultPriceValidators)] }),
    goldPrice: new FormControl({ value: '', disabled: true }, { nonNullable: true, validators: [validateByTrimming(defaultPriceValidators)] }),
    silverPrice: new FormControl({ value: '', disabled: true }, { nonNullable: true, validators: [validateByTrimming(defaultPriceValidators)] })
  })

  protected readonly submitted = signal(false)
  protected readonly messages = {
    screenId: { required: 'Choose a screen' },
    date: { required: 'Choose a date' },
    startTime: { required: 'Choose a start time' },
    price: {
      required: 'Enter a ticket price',
      pattern: 'Use whole rupees',
      min: `At least ₹${MIN_TICKET_PRICE}`,
      max: `At most ₹${MAX_TICKET_PRICE}`
    }
  }

  // Movie search ------------------------------------------------------------------------

  protected readonly query = signal('')
  protected readonly movie = signal<ICSMovieRes | null>(null)
  protected readonly searching = signal(false)
  protected readonly searchFailed = signal(false)
  protected readonly movies = toSignal(toObservable(this.query).pipe(
    map(text => text.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(text => {
      this.searching.set(true)
      this.searchFailed.set(false)
      const request = text === '' ? this.movieRepo.findAllMovies() : this.movieRepo.searchMovie(text)
      return request.pipe(
        map(res => { this.searching.set(false); return (res.data ?? []).slice(0, 8) }),
        catchError(() => { this.searching.set(false); this.searchFailed.set(true); return of([]) })
      )
    })
  ), { initialValue: [] })

  // Screens and the seat categories each one has --------------------------------------

  protected readonly screens = rxResource({
    params: () => this.theater()?._id ?? '',
    stream: ({ params }) => this.screenRepo.findScreens(params).pipe(map(res => res.data ?? []))
  })

  private readonly screenId = toSignal(this.form.controls.screenId.valueChanges.pipe(startWith('')), { initialValue: '' })

  protected readonly categories = rxResource({
    params: () => this.screenId(),
    stream: ({ params }) => params === ''
      ? of([])
      : this.screenRepo.getAvailSeatsOnScreen(params).pipe(map(res => {
        const names = res.data
        if (names === null) return []
        return CATEGORIES.filter(key => names[key] !== undefined && names[key] !== null && names[key] !== '')
          .map(key => ({ key, label: names[key] as string, control: `${key}Price` as const }))
      }))
  })

  // Show length -------------------------------------------------------------------------

  private readonly startTime = toSignal(this.form.controls.startTime.valueChanges, { initialValue: '' })
  protected readonly endTime = computed(() => {
    const movie = this.movie()
    const start = this.startTime()
    if (movie === null || start === '') return null
    const [hours, minutes] = start.split(':').map(Number)
    const end = new Date()
    end.setHours(hours, minutes + movie.duration.hours * 60 + movie.duration.minutes, 0, 0)
    return end
  })

  protected readonly runtime = computed(() => {
    const duration = this.movie()?.duration
    return duration !== undefined ? `${duration.hours}h ${duration.minutes.toString().padStart(2, '0')}m` : ''
  })

  constructor () {
    // Open on the day the theater was looking at
    effect(() => { this.form.controls.date.setValue(this.date() < this.today ? this.today : this.date()) })

    // Only categories the chosen screen has need a price
    effect(() => {
      const available = new Set((valueOf(this.categories) ?? []).map(category => category.key))
      for (const key of CATEGORIES) {
        const control = this.form.controls[`${key}Price`]
        if (available.has(key)) control.enable()
        else { control.disable(); control.reset() }
      }
    })
  }

  protected pickMovie (movie: ICSMovieRes): void {
    this.movie.set(movie)
  }

  protected changeMovie (): void {
    this.movie.set(null)
  }

  protected submit (): void {
    this.submitted.set(true)
    const movie = this.movie()
    if (this.form.invalid || movie === null) return

    const value = this.form.getRawValue()
    const [hours, minutes] = value.startTime.split(':').map(Number)
    const [year, month, day] = value.date.split('-').map(Number)
    const result: ShowFormResult = {
      movieId: movie._id,
      screenId: value.screenId,
      date: value.date,
      startTime: new Date(year, month - 1, day, hours, minutes, 0, 0)
    }
    for (const { key } of valueOf(this.categories) ?? []) {
      result[`${key}Price`] = Number(value[`${key}Price`])
    }
    this.modal.close(result)
  }
}
