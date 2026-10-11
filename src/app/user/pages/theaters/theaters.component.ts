import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core'
import { rxResource, takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { debounceTime, distinctUntilChanged, map } from 'rxjs'
import { distanceKm, formatDistance } from 'src/app/helpers/distance'
import { type ITheaterRes } from 'src/app/models/theater'
import { LocationService } from 'src/app/services/location.service'
import { TheaterService } from 'src/app/services/theater.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { selectCoords } from 'src/app/states/coords/coords.selector'
import { UserNavComponent } from '../user-nav/user-nav.component'
import { valueOf } from 'src/app/helpers/resource'

// Used when the browser can't share a location: Ramanattukara
const FALLBACK = { name: 'Ramanattukara', coordinates: [75.869032, 11.178324] }
const SEARCH_DEBOUNCE_MS = 250

interface TheaterCard {
  id: string
  name: string
  place: string
  image: string | null
  distance: string
  directions: string
  searchText: string
}

function toTheaterCard (theater: ITheaterRes, from: number[]): TheaterCard {
  const [lon, lat] = theater.coords.coordinates
  const place = [theater.address.landmark, theater.address.city].filter(Boolean).join(', ')
  return {
    id: theater._id,
    name: theater.name,
    place,
    image: theater.profilePic !== undefined && theater.profilePic !== '' ? imagesFolderPath + theater.profilePic : null,
    distance: formatDistance(distanceKm(from, theater.coords.coordinates)),
    directions: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
    searchText: [theater.name, place, theater.address.district].join(' ').toLowerCase()
  }
}

@Component({
  selector: 'app-user-theaters',
  templateUrl: './user-theaters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, ButtonDirective]
})
export class UserTheatersComponent {
  private readonly store = inject(Store)
  private readonly theaterService = inject(TheaterService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  protected readonly location = inject(LocationService)

  // Where distances are measured from --------------------------------------

  private readonly coords = this.store.selectSignal(selectCoords)
  protected readonly usingFallback = computed(() => this.coords() === null && ['denied', 'unsupported'].includes(this.location.status()))

  // Compared by value so a repeated GPS reading doesn't refetch
  private readonly origin = computed(() => {
    const coords = this.coords()?.coordinates
    if (coords !== undefined) return coords
    return this.usingFallback() ? FALLBACK.coordinates : undefined
  }, { equal: (a, b) => a?.[0] === b?.[0] && a?.[1] === b?.[1] })

  protected readonly fallbackName = FALLBACK.name

  // Theaters, nearest first (the API sorts by distance) --------------------

  protected readonly theaters = rxResource({
    params: () => this.origin(),
    stream: ({ params: origin }) => this.theaterService.getNearestTheaters(origin[0], origin[1]).pipe(
      map(res => res.data.map(theater => toTheaterCard(theater, origin)))
    )
  })

  // Search: typed text follows ?q= (e.g. on back) and filters after a short pause

  private readonly queryText = toSignal(this.route.queryParamMap.pipe(map(params => params.get('q') ?? '')), { requireSync: true })
  protected readonly searchText = linkedSignal(() => this.queryText())
  // Trimmed search text, as typed, once typing pauses
  protected readonly search = toSignal(
    toObservable(this.searchText).pipe(debounceTime(SEARCH_DEBOUNCE_MS), map(text => text.trim()), distinctUntilChanged()),
    { initialValue: this.queryText().trim() }
  )

  protected readonly visibleTheaters = computed(() => {
    const term = this.search().toLowerCase()
    const list = valueOf(this.theaters) ?? []
    return term === '' ? list : list.filter(theater => theater.searchText.includes(term))
  })

  protected readonly skeletons = [0, 1, 2, 3, 4, 5]

  constructor () {
    toObservable(this.search).pipe(takeUntilDestroyed()).subscribe(term => {
      void this.router.navigate([], { relativeTo: this.route, queryParams: { q: term !== '' ? term : null }, replaceUrl: true })
    })
  }

  protected clearSearch (): void {
    this.searchText.set('')
  }
}
