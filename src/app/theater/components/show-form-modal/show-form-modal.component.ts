import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core'
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { FormField, form, validate } from '@angular/forms/signals'
import { Store } from '@ngrx/store'
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs'
import { dateToString } from 'src/app/shared/utils/date'
import { type ICSMovieRes } from 'src/app/core/models/movie.model'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { TheaterMovieRepo } from 'src/app/theater/repos/movie.repo'
import { TheaterScreenRepo } from 'src/app/theater/repos/screen.repo'
import { MAX_TICKET_PRICE, MIN_TICKET_PRICE, numRegex } from 'src/app/core/constants/constants'
import { checkText, textRules } from 'src/app/shared/utils/form-rules'
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
  imports: [FormField, DatePipe, ButtonDirective, FieldErrorComponent]
})
export class ShowFormModalComponent {
  protected readonly modal = inject(ActiveModal)
  private readonly movieRepo = inject(TheaterMovieRepo)
  private readonly screenRepo = inject(TheaterScreenRepo)
  private readonly theater = inject(Store).selectSignal(selectTheaterDetails)

  /** Day the form opens on */
  readonly date = signal(dateToString(new Date()))
  protected readonly today = dateToString(new Date())

  private readonly model = signal({ screenId: '', date: this.today, startTime: '', diamondPrice: '', goldPrice: '', silverPrice: '' })
  protected readonly form = form(this.model, p => {
    textRules(p.screenId, { required: 'Choose a screen' })
    textRules(p.date, { required: 'Choose a date' })
    textRules(p.startTime, { required: 'Choose a start time' })
    // Only categories the chosen screen has need a price
    for (const key of CATEGORIES) {
      validate(p[`${key}Price`], ({ value }) => this.available().has(key)
        ? checkText(value().trim(), {
          required: 'Enter a ticket price',
          pattern: [numRegex, 'Use whole rupees'],
          min: [MIN_TICKET_PRICE, `At least ₹${MIN_TICKET_PRICE}`],
          max: [MAX_TICKET_PRICE, `At most ₹${MAX_TICKET_PRICE}`]
        })
        : undefined)
    }
  })

  protected readonly submitted = signal(false)

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

  private readonly screenId = computed(() => this.model().screenId)

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

  private readonly available = computed(() => new Set((valueOf(this.categories) ?? []).map(category => category.key)))

  // Show length -------------------------------------------------------------------------

  private readonly startTime = computed(() => this.model().startTime)
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
    effect(() => {
      const date = this.date() < this.today ? this.today : this.date()
      this.model.update(value => ({ ...value, date }))
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
    if (this.form().invalid() || movie === null) return

    const value = this.model()
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
