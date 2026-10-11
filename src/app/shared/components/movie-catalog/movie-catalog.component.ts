import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource, takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, type ParamMap, Router } from '@angular/router'
import { debounceTime, distinctUntilChanged, map, type Observable } from 'rxjs'
import { isGenreType, isLangType } from 'src/app/shared/utils/movie'
import { type MovieCard, toFilterOptions, toMovieCard } from 'src/app/shared/utils/movie-card'
import { type genreType, type langType } from 'src/app/core/models/filter.model'
import { type ICSMovieRes } from 'src/app/core/models/movie.model'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { ConfirmService } from 'src/app/shared/ui/confirm-dialog.component'
import { InViewDirective } from 'src/app/shared/ui/in-view.directive'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { ToastService } from 'src/app/core/toast/toast.service'
import { valueOf } from 'src/app/shared/utils/resource'
import { MovieCatalogSource } from './movie-catalog-source'

const PAGE_SIZE = 10 // fixed by the backend
const SEARCH_DEBOUNCE_MS = 350

interface MovieQuery { search: string, genres: genreType[], languages: langType[] }
interface CatalogueMovie { card: MovieCard, removed: boolean }
interface MoviePage { page: number, movies: CatalogueMovie[], complete: boolean }

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

function matchesFilters (movie: ICSMovieRes, query: MovieQuery): boolean {
  const genreOk = query.genres.length === 0 || movie.genre_ids.some(id => query.genres.includes(id))
  const languageOk = query.languages.length === 0 || query.languages.includes(movie.language)
  return genreOk && languageOk
}

function toggle<T> (list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(item => item !== value) : [...list, value]
}

function toEntry (movie: ICSMovieRes): CatalogueMovie {
  return { card: toMovieCard(movie), removed: movie.isDeleted }
}

/**
 * The CineSnap movie catalogue with search, genre and language chips, all kept in the URL (?q=&genre=&lang=).
 * Movies come from the MovieCatalogSource the host page provides; a source that can delete also lists removed movies
 * and adds Remove / Restore on each card.
 */
@Component({
  selector: 'app-movie-catalog',
  templateUrl: './movie-catalog.component.html',
  styleUrl: './movie-catalog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, InViewDirective, StatePanelComponent]
})
export class MovieCatalogComponent {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly source = inject(MovieCatalogSource)
  private readonly confirm = inject(ConfirmService)
  private readonly toast = inject(ToastService)

  /** Manage mode: removed movies are listed too, with Remove / Restore */
  protected readonly manage = this.source.deleteMovie !== undefined

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true })
  protected readonly query = computed(() => readQuery(this.params()), { equal: sameQuery })
  protected readonly hasFilters = computed(() => {
    const { search, genres, languages } = this.query()
    return search !== '' || genres.length > 0 || languages.length > 0
  })

  protected readonly filterOptions = rxResource({
    stream: () => this.source.fetchFilterDatas().pipe(map(res => toFilterOptions(res.genres, res.languages)))
  })

  protected readonly searchText = linkedSignal(() => this.query().search)

  private readonly page = linkedSignal({ source: this.query, computation: () => 1 })

  private readonly pageResource = rxResource({
    params: () => ({ query: this.query(), page: this.page() }),
    stream: ({ params }) => this.fetchPage(params.query, params.page)
  })

  /** All pages loaded so far; Remove / Restore update entries in place */
  protected readonly movies = linkedSignal<MoviePage | undefined, CatalogueMovie[]>({
    source: () => valueOf(this.pageResource),
    computation: (page, previous) => {
      if (page === undefined) return previous?.value ?? []
      return page.page === 1 ? page.movies : [...(previous?.value ?? []), ...page.movies]
    }
  })

  protected readonly isLoading = this.pageResource.isLoading
  protected readonly error = this.pageResource.error
  protected readonly isComplete = computed(() => valueOf(this.pageResource)?.complete ?? false)
  protected readonly isFirstLoad = computed(() => this.isLoading() && this.movies().length === 0)
  protected readonly isRefreshing = computed(() => this.isLoading() && this.page() === 1 && this.movies().length > 0)
  protected readonly canLoadMore = computed(() => !this.isLoading() && !this.isComplete() && this.error() === undefined)
  protected readonly busy = signal<string | null>(null)
  protected readonly skeletons = Array.from({ length: 10 }, (_, i) => i)

  constructor () {
    toObservable(this.searchText).pipe(
      map(text => text.trim()),
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(search => { this.updateQuery({ search }) })
  }

  protected toggleGenre (genre: genreType): void { this.updateQuery({ genres: toggle(this.query().genres, genre) }) }
  protected toggleLanguage (language: langType): void { this.updateQuery({ languages: toggle(this.query().languages, language) }) }

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

  /** Manage mode: hide a movie from movie-goers and theaters, or bring it back */
  protected async toggleRemoved (movie: CatalogueMovie): Promise<void> {
    const removing = !movie.removed
    if (removing) {
      const confirmed = await this.confirm.confirm({
        title: `Remove ${movie.card.title}?`,
        message: 'It\'s hidden from movie-goers and theaters until you restore it.',
        confirmLabel: 'Remove movie',
        tone: 'danger'
      })
      if (!confirmed) return
    }
    if (this.source.deleteMovie === undefined) return
    this.busy.set(movie.card.id)
    this.source.deleteMovie(movie.card.id).subscribe({
      next: () => {
        this.busy.set(null)
        this.movies.update(list => list.map(m => m.card.id === movie.card.id ? { ...m, removed: removing } : m))
        this.toast.success(removing ? `${movie.card.title} removed` : `${movie.card.title} restored`)
      },
      error: () => { this.busy.set(null) }
    })
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
      replaceUrl: changes.search !== undefined && changes.genres === undefined
    })
  }

  private fetchPage (query: MovieQuery, page: number): Observable<MoviePage> {
    if (query.search !== '') {
      // Title search isn't paginated or filtered by the backend, so apply the chips here
      return this.source.searchMovie(query.search).pipe(map(res => ({
        page: 1,
        complete: true,
        movies: res.data.filter(movie => matchesFilters(movie, query)).map(toEntry)
      })))
    }
    const filters = { availability: this.manage ? 'All' as const : 'Available' as const, filterGenres: query.genres, filterLanguages: query.languages }
    return this.source.findCineSnapFilteredMovies(filters, page).pipe(map(res => ({
      page,
      complete: res.data.length < PAGE_SIZE,
      movies: res.data.map(toEntry)
    })))
  }
}
