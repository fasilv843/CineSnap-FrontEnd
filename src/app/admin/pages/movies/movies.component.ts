import { ChangeDetectionStrategy, Component } from '@angular/core'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { MovieCatalogComponent } from '../../../shared/components/movie-catalog/movie-catalog.component'
import { MovieCatalogSource } from '../../../shared/components/movie-catalog/movie-catalog-source'
import { AdminMoviesTabsComponent } from '../../components/movies-tabs/movies-tabs.component'
import { AdminMovieRepo } from '../../repos/movie.repo'

@Component({
  selector: 'app-admin-cs-movies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, MovieCatalogComponent, AdminMoviesTabsComponent],
  providers: [{ provide: MovieCatalogSource, useExisting: AdminMovieRepo }],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
      <cs-page-header heading="Movies" description="Remove a movie to hide it everywhere; restore it any time." />
      <app-admin-movies-tabs class="mt-6 block" />
      <app-movie-catalog class="mt-6 block" />
    </main>
  `
})
export class AdminMoviesComponent {}
