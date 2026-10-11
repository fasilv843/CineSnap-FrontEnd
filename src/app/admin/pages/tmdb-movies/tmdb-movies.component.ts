import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { catchError, forkJoin, map, of } from 'rxjs'
import { type Movie } from 'src/app/core/models/movie.model'
import { AdminTmdbRepo } from 'src/app/admin/repos/tmdb.repo'
import { Language, LanguageAbbreviation } from 'src/app/core/constants/languages'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { SearchFieldComponent } from 'src/app/shared/ui/search-field.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { injectUrlPaging } from 'src/app/shared/ui/url-paging'
import { TmdbMovieCardComponent } from '../../components/tmdb-movie-card/tmdb-movie-card.component'
import { AdminMoviesTabsComponent } from '../../components/movies-tabs/movies-tabs.component'
import { TmdbImportService } from '../../services/tmdb-import.service'

const ROW_LANGUAGES = [Language.MALAYALAM, Language.TAMIL, Language.HINDI, Language.TELUGU, Language.KANNADA, Language.ENGLISH]

interface LanguageRow { code: Language, name: string, movies: Movie[], failed: boolean }

@Component({
  selector: 'app-admin-movies',
  templateUrl: './tmdb-movies.component.html',
  styleUrl: './tmdb-movies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent, SearchFieldComponent, StatePanelComponent, TmdbMovieCardComponent, AdminMoviesTabsComponent]
})
export class AdminTmdbMoviesComponent {
  private readonly tmdb = inject(AdminTmdbRepo)
  protected readonly importer = inject(TmdbImportService)

  // Only ?q= is used here (search); the rows aren't paged
  protected readonly search = injectUrlPaging()

  /** Newest releases per language; one failing language doesn't hide the others */
  protected readonly rows = rxResource({
    stream: () => forkJoin(ROW_LANGUAGES.map(code => this.tmdb.fetchMovieByLanguage(code).pipe(
      map((movies): LanguageRow => ({ code, name: LanguageAbbreviation[code], movies, failed: false })),
      catchError(() => of<LanguageRow>({ code, name: LanguageAbbreviation[code], movies: [], failed: true }))
    )))
  })

  protected readonly results = rxResource({
    params: () => this.search.query() || undefined,
    stream: ({ params }) => this.tmdb.searchMovieByName(params)
  })

  constructor () {
    this.importer.reload() // pick up movies added elsewhere since the last visit
  }
}
