import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core'
import { rxResource, takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, type ParamMap, Router } from '@angular/router'
import { debounceTime, distinctUntilChanged, map, type Observable } from 'rxjs'
import { isGenreType, isLangType } from 'src/app/helpers/movie'
import { type MovieCard, toFilterOptions, toMovieCard } from 'src/app/helpers/movie-card'
import { type genreType, type langType } from 'src/app/models/filter'
import { type ICSMovieRes } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { InViewDirective } from 'src/app/shared/ui/in-view.directive'
import { UserNavComponent } from '../user-nav/user-nav.component'

const PAGE_SIZE = 10 // fixed by the backend
const SEARCH_DEBOUNCE_MS = 350

/** Everything that decides which movies are listed. Lives in the URL: ?q=&genre=&genre=&lang= */
interface MovieQuery {
  search: string
  genres: genreType[]
  languages: langType[]
}

interface MoviePage {
  page: number
  movies: MovieCard[]
  complete: boolean
}

function readQuery (params: ParamMap): MovieQuery {
  return {
    search: params.get('q')?.trim() ?? '',
    genres: params.getAll('genre').map(Number).filter(isGenreType),
    languages: params.getAll('lang').filter(code => isLangType(code as langType)) as langType[]
  }
}

function sameQuery (a: MovieQuery, b: MovieQuery): boolean {
  return a.search === b.search && a.genres.join() === b.genres.join() && a.languages.join() === b.languages.join()
}

// Same rule as the backend's filtered list: any selected genre AND any selected language
function matchesFilters (movie: ICSMovieRes, query: MovieQuery): boolean {
  const genreOk = query.genres.length === 0 || movie.genre_ids.some(id => query.genres.includes(id))
  const languageOk = query.languages.length === 0 || query.languages.includes(movie.language)
  return genreOk && languageOk
}

function toggle<T> (list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(item => item !== value) : [...list, value]
}

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrl: './user-movies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, ButtonDirective, InViewDirective]
})
export class UserMoviesComponent {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly movieService = inject(MovieService)

  // Query -------------------------------------------------------------------
  // The URL is the single source of truth, so back/forward and shared links restore the same list.

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true })
  protected readonly query = computed(() => readQuery(this.params()), { equal: sameQuery })

  protected readonly hasFilters = computed(() => {
    const { search, genres, languages } = this.query()
    return search !== '' || genres.length > 0 || languages.length > 0
  })

  protected readonly filterOptions = rxResource({
    stream: () => this.movieService.fetchFilterDatas().pipe(map(res => toFilterOptions(res.genres, res.languages)))
  })

  // What's typed in the search box. Follows the URL (e.g. on back), and is written to the URL after a pause in typing.
  protected readonly searchText = linkedSignal(() => this.query().search)

  // Results -----------------------------------------------------------------

  // Page to fetch next; goes back to 1 whenever the query changes
  private readonly page = linkedSignal({ source: this.query, computation: () => 1 })

  private readonly pageResource = rxResource({
    params: () => ({ query: this.query(), page: this.page() }),
    stream: ({ params }) => this.fetchPage(params.query, params.page)
  })

  // All pages loaded so far. A first page replaces the list; later pages are appended.
  protected readonly movies = linkedSignal<MoviePage | undefined, MovieCard[]>({
    source: this.pageResource.value,
    computation: (page, previous) => {
      if (page === undefined) return previous?.value ?? []
      return page.page === 1 ? page.movies : [...(previous?.value ?? []), ...page.movies]
    }
  })

  protected readonly isLoading = this.pageResource.isLoading
  protected readonly error = this.pageResource.error
  protected readonly isComplete = computed(() => this.pageResource.value()?.complete ?? false)
  protected readonly isFirstLoad = computed(() => this.isLoading() && this.movies().length === 0)
  // A new query is loading while the previous results are still on screen
  protected readonly isRefreshing = computed(() => this.isLoading() && this.page() === 1 && this.movies().length > 0)
  protected readonly canLoadMore = computed(() => !this.isLoading() && !this.isComplete() && this.error() === undefined)

  protected readonly skeletons = Array.from({ length: 10 }, (_, i) => i)

  constructor () {
    toObservable(this.searchText).pipe(
      map(text => text.trim()),
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(search => { this.updateQuery({ search }) })
  }

  // Actions -----------------------------------------------------------------

  protected toggleGenre (genre: genreType): void {
    this.updateQuery({ genres: toggle(this.query().genres, genre) })
  }

  protected toggleLanguage (language: langType): void {
    this.updateQuery({ languages: toggle(this.query().languages, language) })
  }

  protected clearFilters (): void {
    this.searchText.set('')
    this.updateQuery({ search: '', genres: [], languages: [] })
  }

  protected loadMore (): void {
    if (this.canLoadMore()) this.page.update(page => page + 1)
  }

  protected retry (): void {
    this.pageResource.reload()
  }

  private updateQuery (changes: Partial<MovieQuery>): void {
    const next = { ...this.query(), ...changes }
    if (sameQuery(next, this.query())) return
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: next.search !== '' ? next.search : null,
        genre: next.genres.length > 0 ? next.genres : null,
        lang: next.languages.length > 0 ? next.languages : null
      },
      // Typing a search shouldn't add a history entry per pause; filter toggles should
      replaceUrl: changes.search !== undefined && changes.genres === undefined
    })
  }

  private fetchPage (query: MovieQuery, page: number): Observable<MoviePage> {
    if (query.search !== '') {
      // Title search isn't paginated or filtered by the backend, so apply the chips here
      return this.movieService.searchMovie(query.search, false).pipe(map(res => ({
        page: 1,
        complete: true,
        movies: res.data.filter(movie => matchesFilters(movie, query)).map(toMovieCard)
      })))
    }
    const filters = { availability: 'Available' as const, filterGenres: query.genres, filterLanguages: query.languages }
    return this.movieService.findCineSnapFilteredMovies(filters, page).pipe(map(res => ({
      page,
      complete: res.data.length < PAGE_SIZE,
      movies: res.data.map(toMovieCard)
    })))
  }
}
