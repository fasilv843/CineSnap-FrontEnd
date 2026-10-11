import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { map, of } from 'rxjs'
import { dateToString } from 'src/app/shared/utils/date'
import { toMovieCard } from 'src/app/shared/utils/movie-card'
import { type ICSMovieRes } from 'src/app/core/models/movie.model'
import { type IShow } from 'src/app/core/models/show.model'
import { type IShowSeatCategoryRes } from 'src/app/core/models/show-seat.model'
import { type ITicketReqs, type ITicketSeat } from 'src/app/core/models/ticket.model'
import { UserShowRepo } from 'src/app/user/repos/show.repo'
import { UserTicketRepo } from 'src/app/user/repos/ticket.repo'
import { ChargePerDiamondTicket, ChargePerGoldTicket, ChargePerSilverTicket } from 'src/app/core/constants/constants'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { IconComponent } from 'src/app/shared/ui/icon.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { selectUserDetails } from 'src/app/core/state/user/user.selector'
import { UserNavComponent } from '../../layout/user-nav/user-nav.component'
import { valueOf } from 'src/app/shared/utils/resource'

interface IShowWithMovie extends Omit<IShow, 'movieId'> {
  movieId: ICSMovieRes | null
}

type CategoryKey = 'diamond' | 'gold' | 'silver'
type SeatStatus = 'free' | 'held' | 'sold'

interface SeatView { id: string, col: number, status: SeatStatus }
interface RowView { label: string, seats: Array<SeatView | null> } // null = aisle gap
interface CategoryView { key: CategoryKey, name: string, price: number, fee: number, rows: RowView[] }

const MAX_SEATS = 10
const FEES: Record<CategoryKey, number> = { diamond: ChargePerDiamondTicket, gold: ChargePerGoldTicket, silver: ChargePerSilverTicket }
const CATEGORY_KEYS: CategoryKey[] = ['diamond', 'gold', 'silver']
const SEAT_LISTS = { diamond: 'diamondSeats', gold: 'goldSeats', silver: 'silverSeats' } as const

function toCategory (key: CategoryKey, category: IShowSeatCategoryRes | undefined, held: Set<string>): CategoryView | null {
  if (category === undefined || category === null) return null
  const rows = Object.entries(category.seats).map(([label, seats]) => ({
    label,
    seats: (seats ?? []).map(seat => {
      if (seat.col === 0) return null
      const id = label + seat.col
      const status: SeatStatus = seat.isBooked ? 'sold' : held.has(id) ? 'held' : 'free'
      return { id, col: seat.col, status }
    })
  }))
  return rows.length > 0 ? { key, name: category.name, price: category.price, fee: FEES[key], rows } : null
}

@Component({
  selector: 'app-show-seats',
  templateUrl: './show-seats.component.html',
  styleUrl: './show-seats.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, DatePipe, ButtonDirective, IconComponent, StatePanelComponent]
})
export class UserShowSeatsComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly store = inject(Store)
  private readonly showRepo = inject(UserShowRepo)
  private readonly ticketRepo = inject(UserTicketRepo)

  protected readonly user = this.store.selectSignal(selectUserDetails)
  protected readonly maxSeats = MAX_SEATS

  private readonly params = toSignal(this.route.paramMap, { requireSync: true })
  private readonly query = toSignal(this.route.queryParamMap, { requireSync: true })
  protected readonly seatMapId = computed(() => this.params().get('seatId') ?? '')
  protected readonly showId = computed(() => this.query().get('showId') ?? '')
  protected readonly theaterId = computed(() => this.query().get('theaterId') ?? '')

  protected readonly seatMap = rxResource({
    params: () => this.seatMapId(),
    stream: ({ params }) => this.showRepo.getShowSeatDetails(params).pipe(map(res => res.data))
  })

  protected readonly show = rxResource({
    params: () => this.showId(),
    stream: ({ params }) => this.showRepo.getShowDetails(params).pipe(map(res => res.data as unknown as IShowWithMovie | null))
  })

  // Seats other people are paying for right now
  private readonly held = rxResource({
    params: () => this.showId(),
    stream: ({ params }) => params === ''
      ? of(new Set<string>())
      : this.ticketRepo.getHoldedSeats(params).pipe(map(res => new Set((res.data ?? []).flatMap(ticket =>
        CATEGORY_KEYS.flatMap(key => ticket[SEAT_LISTS[key]]?.seats ?? [])))))
  })

  protected readonly movie = computed(() => {
    const movie = valueOf(this.show)?.movieId
    return movie !== null && movie !== undefined ? toMovieCard(movie) : null
  })

  protected readonly categories = computed(() => {
    const seats = valueOf(this.seatMap)
    if (seats === null || seats === undefined) return []
    const held = valueOf(this.held) ?? new Set<string>()
    return CATEGORY_KEYS.map(key => toCategory(key, seats[key], held)).filter((category): category is CategoryView => category !== null)
  })

  protected readonly loading = computed(() => this.seatMap.isLoading() || this.show.isLoading() || this.held.isLoading())
  protected readonly failed = computed(() => this.seatMap.error() !== undefined || this.show.error() !== undefined || this.held.error() !== undefined)

  /** Picked seats, in the order picked; cleared when the user switches to another show */
  protected readonly selected = linkedSignal<string, Array<{ id: string, category: CategoryKey }>>({
    source: this.seatMapId,
    computation: () => []
  })

  protected readonly selectedIds = computed(() => new Set(this.selected().map(seat => seat.id)))

  protected readonly summary = computed(() => {
    const byKey = new Map(this.categories().map(category => [category.key, category]))
    const total = this.selected().reduce((sum, seat) => {
      const category = byKey.get(seat.category)
      return sum + (category !== undefined ? category.price + category.fee : 0)
    }, 0)
    return { count: this.selected().length, labels: this.selected().map(seat => seat.id).join(', '), total }
  })

  protected readonly booking = signal(false)
  protected readonly canBook = computed(() => !this.loading() && !this.failed() && valueOf(this.show) != null && this.selected().length > 0 && !this.booking())

  protected readonly backLink = computed(() => this.theaterId() !== '' ? ['/user/theater', this.theaterId()] : ['/user/theaters'])
  // Back on the theater page, open the same day as this show
  protected readonly backQuery = computed(() => {
    const start = valueOf(this.show)?.startTime
    return start !== undefined ? { date: dateToString(new Date(start)) } : {}
  })

  protected toggle (seat: SeatView, category: CategoryKey): void {
    if (seat.status !== 'free') return
    this.selected.update(list => {
      if (list.some(picked => picked.id === seat.id)) return list.filter(picked => picked.id !== seat.id)
      return list.length < MAX_SEATS ? [...list, { id: seat.id, category }] : list
    })
  }

  protected seatLabel (seat: SeatView, category: CategoryView): string {
    const state = seat.status === 'sold' ? 'sold' : seat.status === 'held' ? 'being booked' : `₹${category.price}`
    return `Seat ${seat.id}, ${category.name}, ${state}`
  }

  protected retry (): void {
    this.seatMap.reload()
    this.show.reload()
    this.held.reload()
  }

  protected book (): void {
    const show = valueOf(this.show)
    const user = this.user()
    if (!this.canBook() || show == null || user === null) return

    const byKey = new Map(this.categories().map(category => [category.key, category]))
    const ticket: ITicketReqs = {
      showId: this.showId(),
      screenId: show.screenId,
      movieId: show.movieId?._id ?? '',
      theaterId: this.theaterId(),
      userId: user._id,
      totalPrice: this.summary().total,
      seatCount: this.selected().length,
      startTime: show.startTime,
      endTime: show.endTime
    }

    for (const key of CATEGORY_KEYS) {
      const category = byKey.get(key)
      const seats = this.selected().filter(seat => seat.category === key).map(seat => seat.id)
      if (category === undefined || seats.length === 0) continue
      const line: ITicketSeat = {
        seats,
        name: category.name,
        singlePrice: category.price,
        CSFeePerTicket: category.fee,
        totalPrice: (category.price + category.fee) * seats.length
      }
      ticket[SEAT_LISTS[key]] = line
    }

    this.booking.set(true)
    this.ticketRepo.bookTicket(ticket).subscribe({
      next: res => {
        this.booking.set(false)
        if (res.data != null) void this.router.navigate(['/user/show/book', res.data._id])
      },
      // The error toast comes from the HTTP error handler; refresh holds in case someone took the seats
      error: () => { this.booking.set(false); this.held.reload() }
    })
  }
}
