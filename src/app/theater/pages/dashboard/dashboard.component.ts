import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { dateToString } from 'src/app/shared/utils/date'
import { type IShowsOnAScreen } from 'src/app/core/models/show.model'
import { TheaterAccountRepo } from 'src/app/theater/repos/account.repo'
import { TheaterShowRepo } from 'src/app/theater/repos/show.repo'
import { TheaterTicketRepo } from 'src/app/theater/repos/ticket.repo'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { RevenueChartComponent } from 'src/app/shared/ui/revenue-chart.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { StatTileComponent } from 'src/app/shared/ui/stat-tile.component'
import { selectTheaterDetails } from 'src/app/core/state/theater/theater.selector'
import { valueOf } from 'src/app/shared/utils/resource'

const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

interface TodayShow {
  id: string
  movie: string
  screen: string
  start: Date
  sold: number
  total: number
}

/** Every show of the day across screens, earliest first */
function toTodayShows (screens: IShowsOnAScreen[]): TodayShow[] {
  return screens
    .flatMap(screen => screen.shows.flatMap(group => group.shows.map((show): TodayShow => ({
      id: show._id,
      movie: group.movieId?.title ?? 'Movie no longer listed',
      screen: screen.screenName,
      start: new Date(show.startTime),
      sold: show.totalSeatCount - show.availableSeatCount,
      total: show.totalSeatCount
    }))))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

@Component({
  selector: 'app-thr-home',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, ButtonDirective, PageHeaderComponent, RevenueChartComponent, StatePanelComponent, StatTileComponent]
})
export class TheaterDashboardComponent {
  private readonly accountRepo = inject(TheaterAccountRepo)
  private readonly showRepo = inject(TheaterShowRepo)
  private readonly ticketRepo = inject(TheaterTicketRepo)

  protected readonly theater = inject(Store).selectSignal(selectTheaterDetails)
  private readonly theaterId = computed(() => this.theater()?._id ?? '')
  protected readonly today = new Date()

  protected readonly revenue = rxResource({
    params: () => this.theaterId(),
    stream: ({ params }) => this.accountRepo.getRevenueData(params).pipe(map(res => res.data ?? { labels: [], data: [] }))
  })

  protected readonly shows = rxResource({
    params: () => this.theaterId(),
    stream: ({ params }) => this.showRepo.findShowsOnDateForTheater(params, dateToString(this.today)).pipe(
      map(res => toTodayShows(res.data ?? []))
    )
  })

  // Only the count is needed, so ask for a single row
  protected readonly ticketCount = rxResource({
    params: () => this.theaterId(),
    stream: ({ params }) => this.ticketRepo.getAllTicketsOfTheater(params, 1, 1).pipe(map(res => res.data?.ticketCount ?? 0))
  })

  protected readonly revenueTotal = computed(() => rupees.format((valueOf(this.revenue)?.data ?? []).reduce((sum, value) => sum + value, 0)))
  protected readonly wallet = computed(() => rupees.format(this.theater()?.wallet ?? 0))
  protected readonly soldToday = computed(() => (valueOf(this.shows) ?? []).reduce((sum, show) => sum + show.sold, 0))
  protected readonly todayCount = computed(() => (valueOf(this.shows) ?? []).length)
  protected readonly ticketTotal = computed(() => valueOf(this.ticketCount) ?? 0)
  protected readonly hasRevenue = computed(() => (valueOf(this.revenue)?.data ?? []).some(value => value > 0))

  protected fill (show: TodayShow): number {
    return show.total > 0 ? Math.round((show.sold / show.total) * 100) : 0
  }
}
