import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { dateToString } from 'src/app/helpers/date'
import { distanceKm, formatDistance } from 'src/app/helpers/distance'
import { type MovieCard, toMovieCard } from 'src/app/helpers/movie-card'
import { type IShowsOnAScreen } from 'src/app/models/show'
import { ShowService } from 'src/app/services/show.service'
import { TheaterService } from 'src/app/services/theater.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { AvatarComponent } from 'src/app/shared/ui/avatar.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { selectCoords } from 'src/app/states/coords/coords.selector'
import { UserNavComponent } from '../user-nav/user-nav.component'
import { valueOf } from 'src/app/helpers/resource'

const DAYS_AHEAD = 7

type Availability = 'plenty' | 'filling' | 'few' | 'sold-out'

interface Showtime {
  showId: string
  seatId: string
  start: Date
  screen: string
  seatsLeft: number
  availability: Availability
}

interface MovieShows {
  movie: MovieCard
  showtimes: Showtime[]
}

function availability (left: number, total: number): Availability {
  if (left <= 0) return 'sold-out'
  const free = left / total
  return free >= 0.5 ? 'plenty' : free >= 0.2 ? 'filling' : 'few'
}

/** The API groups shows by screen, then movie; people choose by movie, so regroup by movie across screens. */
function groupByMovie (screens: IShowsOnAScreen[]): MovieShows[] {
  const byMovie = new Map<string, MovieShows>()
  for (const screen of screens) {
    for (const { movieId: movie, shows } of screen.shows) {
      const entry = byMovie.get(movie._id) ?? { movie: toMovieCard(movie), showtimes: [] }
      for (const show of shows) {
        entry.showtimes.push({
          showId: show._id,
          seatId: show.seatId,
          start: new Date(show.startTime),
          screen: screen.screenName,
          seatsLeft: show.availableSeatCount,
          availability: availability(show.availableSeatCount, show.totalSeatCount)
        })
      }
      byMovie.set(movie._id, entry)
    }
  }
  const groups = [...byMovie.values()]
  groups.forEach(group => group.showtimes.sort((a, b) => a.start.getTime() - b.start.getTime()))
  return groups.sort((a, b) => a.showtimes[0].start.getTime() - b.showtimes[0].start.getTime())
}

@Component({
  selector: 'app-theater-page',
  templateUrl: './theater-page.component.html',
  styleUrl: './theater-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, ButtonDirective, AvatarComponent, DatePipe]
})
export class TheaterPageComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly showService = inject(ShowService)
  private readonly theaterService = inject(TheaterService)
  private readonly store = inject(Store)

  protected readonly theaterId = toSignal(this.route.paramMap.pipe(map(params => params.get('theaterId') ?? '')), { requireSync: true })

  // Selectable days, today first; the chosen one lives in ?date=YYYY-MM-DD
  protected readonly days = Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() + i)
    return { key: dateToString(day), date: day, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : null }
  })

  private readonly query = toSignal(this.route.queryParamMap, { requireSync: true })
  protected readonly selectedDay = computed(() => {
    const key = this.query().get('date')
    return this.days.find(day => day.key === key) ?? this.days[0]
  })

  // Theater details ----------------------------------------------------------

  protected readonly theater = rxResource({
    params: () => this.theaterId(),
    stream: ({ params: id }) => this.theaterService.getTheaterData(id).pipe(map(res => {
      const t = res.data
      const [lon, lat] = t.coords.coordinates
      return {
        name: t.name,
        image: t.profilePic !== undefined && t.profilePic !== '' ? imagesFolderPath + t.profilePic : null,
        address: [t.address.landmark, t.address.city, t.address.district, t.address.state, t.address.zip].filter(Boolean).join(', '),
        coordinates: t.coords.coordinates,
        directions: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
      }
    }))
  })

  private readonly userCoords = this.store.selectSignal(selectCoords)
  protected readonly distance = computed(() => {
    const from = this.userCoords()?.coordinates
    const to = valueOf(this.theater)?.coordinates
    return from !== undefined && to !== undefined ? formatDistance(distanceKm(from, to)) : null
  })

  // Shows on the selected day --------------------------------------------------

  protected readonly shows = rxResource({
    params: () => ({ theaterId: this.theaterId(), date: this.selectedDay().key }),
    stream: ({ params }) => this.showService.findShowsOnDate(params.theaterId, params.date).pipe(
      map(res => groupByMovie(res.data ?? []))
    )
  })

  protected selectDay (key: string): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { date: key }, replaceUrl: true })
  }

  protected openSeats (showtime: Showtime): void {
    void this.router.navigate(['/user/show/seats', showtime.seatId], {
      queryParams: { showId: showtime.showId, theaterId: this.theaterId() }
    })
  }
}
