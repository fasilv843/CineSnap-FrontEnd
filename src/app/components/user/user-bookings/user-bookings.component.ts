import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import {
  createColumnHelper, createPaginatedRowModel, createSortedRowModel, injectTable,
  rowPaginationFeature, rowSortingFeature, type SortingState, tableFeatures
} from '@tanstack/angular-table'
import { map } from 'rxjs'
import { getLanguage } from 'src/app/helpers/movie'
import { type ITicketRes } from 'src/app/models/ticket'
import { TicketService } from 'src/app/services/ticket.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { ConfirmService } from 'src/app/shared/ui/confirm-dialog.component'
import { PaginationComponent } from 'src/app/shared/ui/pagination.component'
import { fetchUserData } from 'src/app/states/user/user.actions'
import { selectUserDetails } from 'src/app/states/user/user.selector'
import { UserNavComponent } from '../user-nav/user-nav.component'

const PAGE_SIZES = [10, 20, 50]
const CANCEL_CUTOFF_HOURS = 4 // backend rule: bookings can be cancelled until 4 hours before the show

type BookingStatus = 'upcoming' | 'showing' | 'watched' | 'cancelled'
type Tab = 'upcoming' | 'past' | 'cancelled' | 'all'

interface BookingRow {
  id: string
  movie: string
  poster: string
  language: string
  theater: string
  screen: string
  startTime: Date
  seats: string[]
  amount: number
  payment: string
  status: BookingStatus
  cancelledBy?: 'User' | 'Theater' | 'Admin'
  canCancel: boolean
}

// The backend populates references with null when the screen, theater or movie has since been deleted
type StoredTicket = Omit<ITicketRes, 'movieId' | 'theaterId' | 'screenId'> & {
  movieId: ITicketRes['movieId'] | null
  theaterId: ITicketRes['theaterId'] | null
  screenId: ITicketRes['screenId'] | null
}

function toBookingRow (ticket: StoredTicket, now: Date): BookingRow {
  const start = new Date(ticket.startTime)
  const end = new Date(ticket.endTime)
  const seats = [ticket.diamondSeats, ticket.goldSeats, ticket.silverSeats].flatMap(tier => tier?.seats ?? []).sort()
  const status: BookingStatus = ticket.isCancelled ? 'cancelled' : end < now ? 'watched' : start <= now ? 'showing' : 'upcoming'
  const movie = ticket.movieId
  return {
    id: ticket._id,
    movie: movie?.title ?? 'Movie removed',
    poster: movie !== null ? `https://image.tmdb.org/t/p/w154${movie.poster_path}` : '',
    language: movie !== null ? getLanguage(movie.language) : '',
    theater: ticket.theaterId?.name ?? 'Theater removed',
    screen: ticket.screenId?.name ?? 'Screen removed',
    startTime: start,
    seats,
    amount: ticket.totalPrice,
    payment: ticket.paymentMethod,
    status,
    cancelledBy: ticket.cancelledBy,
    canCancel: status === 'upcoming' && start.getTime() - now.getTime() > CANCEL_CUTOFF_HOURS * 3600_000
  }
}

const TAB_FILTERS: Record<Tab, (row: BookingRow) => boolean> = {
  upcoming: row => row.status === 'upcoming' || row.status === 'showing',
  past: row => row.status === 'watched',
  cancelled: row => row.status === 'cancelled',
  all: () => true
}

// Every ticket comes back in one response, so sorting and paging run in the browser
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel()
})
const column = createColumnHelper<typeof features, BookingRow>()
const columns = column.columns([
  column.accessor('movie', { header: 'Movie', enableSorting: false }),
  column.accessor('theater', { header: 'Theater', enableSorting: false }),
  column.accessor(row => row.startTime.getTime(), { id: 'showTime', header: 'Show time' }),
  column.accessor('seats', { header: 'Seats', enableSorting: false }),
  column.accessor('amount', { header: 'Amount' }),
  column.accessor('status', { header: 'Status', enableSorting: false }),
  column.display({ id: 'actions', header: 'Actions' })
])

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, ButtonDirective, PaginationComponent, DatePipe]
})
export class UserBookingsComponent {
  private readonly ticketService = inject(TicketService)
  private readonly confirmService = inject(ConfirmService)
  private readonly store = inject(Store)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  private readonly userId = this.store.selectSignal(selectUserDetails)()?._id ?? ''
  protected readonly pageSizes = PAGE_SIZES
  protected readonly tabs: Array<{ id: Tab, label: string }> = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'all', label: 'All' }
  ]

  // View state from the URL: ?tab=past&page=2&limit=20 -----------------------

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true })
  protected readonly tab = computed<Tab>(() => {
    const tab = this.params().get('tab') as Tab | null
    return tab !== null && tab in TAB_FILTERS ? tab : 'upcoming'
  })

  protected readonly page = computed(() => Math.max(1, Number(this.params().get('page') ?? 1) || 1))
  protected readonly limit = computed(() => {
    const limit = Number(this.params().get('limit'))
    return PAGE_SIZES.includes(limit) ? limit : PAGE_SIZES[0]
  })

  // Data -----------------------------------------------------------------------

  private readonly tickets = rxResource({
    stream: () => this.ticketService.getTicketsOfUser(this.userId).pipe(map(res => res.data as StoredTicket[]))
  })

  // Rows built from the response; cancelling updates a row here without refetching
  protected readonly rows = linkedSignal(() => (this.tickets.value() ?? []).map(ticket => toBookingRow(ticket, new Date())))
  protected readonly isLoading = this.tickets.isLoading
  protected readonly error = this.tickets.error

  protected readonly visibleRows = computed(() => this.rows().filter(TAB_FILTERS[this.tab()]))
  protected readonly counts = computed(() => {
    const rows = this.rows()
    return Object.fromEntries(this.tabs.map(({ id }) => [id, rows.filter(TAB_FILTERS[id]).length])) as Record<Tab, number>
  })

  // Soonest first for upcoming shows, newest first everywhere else; resets when the tab changes
  protected readonly sorting = linkedSignal<SortingState>(() => [{ id: 'showTime', desc: this.tab() !== 'upcoming' }])

  protected readonly table = injectTable(() => ({
    features,
    columns,
    data: this.visibleRows(),
    getRowId: row => row.id,
    autoResetPageIndex: false,
    state: {
      sorting: this.sorting(),
      pagination: { pageIndex: this.page() - 1, pageSize: this.limit() }
    },
    onSortingChange: updater => {
      this.sorting.update(current => typeof updater === 'function' ? updater(current) : updater)
      this.goToPage(1)
    }
  }))

  // Per-row UI state for the invoice email
  protected readonly invoiceState = signal<Record<string, 'sending' | 'sent' | 'failed'>>({})

  protected readonly skeletonRows = [0, 1, 2, 3]

  // Actions --------------------------------------------------------------------

  protected selectTab (tab: Tab): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { tab, page: 1 }, queryParamsHandling: 'merge' })
  }

  protected goToPage (page: number): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page }, queryParamsHandling: 'merge' })
  }

  protected setPageSize (limit: number): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1, limit }, queryParamsHandling: 'merge' })
  }

  protected reload (): void {
    this.tickets.reload()
  }

  protected async cancel (row: BookingRow): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Cancel this booking?',
      message: `${row.movie} on ${row.startTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}. ₹${row.amount} will be refunded to your CineSnap wallet.`,
      confirmLabel: 'Cancel booking',
      tone: 'danger'
    })
    if (!confirmed) return
    this.ticketService.cancelTicket(row.id).subscribe(() => {
      this.rows.update(rows => rows.map(r => r.id === row.id ? { ...r, status: 'cancelled', cancelledBy: 'User', canCancel: false } : r))
      this.store.dispatch(fetchUserData({ userId: this.userId })) // refreshes the wallet balance
    })
  }

  protected emailInvoice (row: BookingRow): void {
    this.invoiceState.update(state => ({ ...state, [row.id]: 'sending' }))
    this.ticketService.sendInvoiceRequest(row.id).subscribe({
      next: () => { this.invoiceState.update(state => ({ ...state, [row.id]: 'sent' })) },
      error: () => { this.invoiceState.update(state => ({ ...state, [row.id]: 'failed' })) }
    })
  }

  protected sortLabel (direction: false | 'asc' | 'desc'): 'ascending' | 'descending' | null {
    return direction === false ? null : direction === 'asc' ? 'ascending' : 'descending'
  }
}
