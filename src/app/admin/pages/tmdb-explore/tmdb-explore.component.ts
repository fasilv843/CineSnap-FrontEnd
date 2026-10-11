import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { map } from 'rxjs'
import { type Movie } from 'src/app/core/models/movie.model'
import { AdminTmdbRepo } from 'src/app/admin/repos/tmdb.repo'
import { type Language, LanguageAbbreviation } from 'src/app/core/constants/languages'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { IconComponent } from 'src/app/shared/ui/icon.component'
import { InViewDirective } from 'src/app/shared/ui/in-view.directive'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { TmdbMovieCardComponent } from '../../components/tmdb-movie-card/tmdb-movie-card.component'
import { TmdbImportService } from '../../services/tmdb-import.service'
import { valueOf } from 'src/app/shared/utils/resource'

const MAX_PAGES = 10
const TMDB_PAGE_SIZE = 20

interface MoviePage { lang: string, page: number, movies: Movie[] }

/** Every recent TMDB release in one language: /admin/movies/:lang */
@Component({
  selector: 'app-admin-movies-explore',
  templateUrl: './tmdb-explore.component.html',
  styleUrl: '../tmdb-movies/tmdb-movies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, IconComponent, InViewDirective, PageHeaderComponent, StatePanelComponent, TmdbMovieCardComponent]
})
export class AdminTmdbExploreComponent {
  private readonly tmdb = inject(AdminTmdbRepo)
  private readonly importer = inject(TmdbImportService)

  protected readonly lang = toSignal(inject(ActivatedRoute).paramMap.pipe(map(params => params.get('lang') ?? 'ml')), { requireSync: true })
  protected readonly languageName = computed(() => (LanguageAbbreviation as Record<string, string>)[this.lang()] ?? this.lang().toUpperCase())

  /** Next page to fetch; back to 1 when the language changes */
  private readonly page = linkedSignal({ source: this.lang, computation: () => 1 })

  private readonly pageResource = rxResource({
    params: () => ({ lang: this.lang(), page: this.page() }),
    stream: ({ params }) => this.tmdb.fetchMovieByLanguage(params.lang as Language, params.page).pipe(
      map((movies): MoviePage => ({ ...params, movies }))
    )
  })

  protected readonly movies = linkedSignal<MoviePage | undefined, Movie[]>({
    source: () => valueOf(this.pageResource),
    computation: (page, previous) => {
      if (page === undefined) return previous?.value ?? []
      // TMDB can repeat a movie across pages while new releases come in
      const earlier = page.page === 1 ? [] : (previous?.value ?? [])
      const seen = new Set(earlier.map(movie => movie.tmdbId))
      return [...earlier, ...page.movies.filter(movie => !seen.has(movie.tmdbId))]
    }
  })

  protected readonly isLoading = this.pageResource.isLoading
  protected readonly error = this.pageResource.error
  // TMDB pages hold 20; posterless movies are dropped, so a short page can still have more after it
  protected readonly isComplete = computed(() => {
    const last = valueOf(this.pageResource)
    return this.page() >= MAX_PAGES || (last !== undefined && last.movies.length < TMDB_PAGE_SIZE / 2)
  })
  protected readonly canLoadMore = computed(() => !this.isLoading() && !this.isComplete() && this.error() === undefined)

  constructor () {
    this.importer.reload()
  }

  protected loadMore (): void {
    if (this.canLoadMore()) this.page.update(page => page + 1)
  }

  protected retry (): void {
    this.pageResource.reload()
  }
}
