import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { toFilterOptions, toMovieCard } from 'src/app/shared/utils/movie-card'
import { distanceKm, formatDistance } from 'src/app/user/utils/distance'
import { LocationService } from 'src/app/user/services/location.service'
import { UserMovieRepo } from 'src/app/user/repos/movie.repo'
import { UserTheaterRepo } from 'src/app/user/repos/theater.repo'
import { imagesFolderPath } from 'src/app/core/constants/constants'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { selectCoords } from 'src/app/core/state/coords/coords.selector'
import { selectUserDetails } from 'src/app/core/state/user/user.selector'
import { UserNavComponent } from '../../layout/user-nav/user-nav.component'
import { valueOf } from 'src/app/shared/utils/resource'

const HERO_INTERVAL_MS = 7000

@Component({
  selector: 'app-user-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, ButtonDirective]
})
export class UserHomeComponent {
  private readonly movieRepo = inject(UserMovieRepo)
  private readonly theaterRepo = inject(UserTheaterRepo)
  private readonly store = inject(Store)
  protected readonly location = inject(LocationService)

  protected readonly user = this.store.selectSignal(selectUserDetails)
  private readonly coords = this.store.selectSignal(selectCoords)
  // Compared by value: a fresh GPS reading with the same position must not refetch theaters
  private readonly coordinates = computed(() => this.coords()?.coordinates, {
    equal: (a, b) => a?.[0] === b?.[0] && a?.[1] === b?.[1]
  })

  protected readonly locationBlocked = computed(() => ['denied', 'unsupported'].includes(this.location.status()))

  // Data ---------------------------------------------------------------------

  protected readonly featured = rxResource({
    stream: () => this.movieRepo.getBannerMovies().pipe(map(res => res.data.map(toMovieCard).filter(m => m.backdrop !== null)))
  })

  protected readonly nowShowing = rxResource({
    stream: () => this.movieRepo
      .findCineSnapFilteredMovies({ availability: 'Available', filterGenres: [], filterLanguages: [] }, 1)
      .pipe(map(res => res.data.map(toMovieCard)))
  })

  protected readonly filters = rxResource({
    stream: () => this.movieRepo.fetchFilterDatas().pipe(map(res => toFilterOptions(res.genres, res.languages)))
  })

  // Re-fetches whenever the stored coordinates change; stays idle (no request) until the location is known
  protected readonly theaters = rxResource({
    params: () => this.coordinates(),
    stream: ({ params: [lon, lat] }) => this.theaterRepo.getNearestTheaters(lon, lat).pipe(
      map(res => res.data.map(theater => ({
        id: theater._id,
        name: theater.name,
        place: [theater.address.landmark, theater.address.city].filter(Boolean).join(', '),
        image: theater.profilePic !== undefined && theater.profilePic !== '' ? imagesFolderPath + theater.profilePic : null,
        distance: formatDistance(distanceKm([lon, lat], theater.coords.coordinates))
      })))
    )
  })

  // Featured hero ------------------------------------------------------------

  protected readonly heroIndex = signal(0)
  protected readonly hero = computed(() => {
    const movies = valueOf(this.featured) ?? []
    return movies.length > 0 ? movies[this.heroIndex() % movies.length] : null
  })

  private heroPaused = false

  constructor () {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reducedMotion) {
      const timer = setInterval(() => {
        const count = valueOf(this.featured)?.length ?? 0
        if (!this.heroPaused && count > 1) this.heroIndex.update(i => (i + 1) % count)
      }, HERO_INTERVAL_MS)
      inject(DestroyRef).onDestroy(() => { clearInterval(timer) })
    }
  }

  protected pauseHero (paused: boolean): void {
    this.heroPaused = paused
  }

  protected readonly skeletons = Array.from({ length: 6 }, (_, i) => i)
}
