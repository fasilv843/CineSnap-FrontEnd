import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { MovieCatalogComponent } from '../../../shared/components/movie-catalog/movie-catalog.component'
import { MovieCatalogSource } from '../../../shared/components/movie-catalog/movie-catalog-source'
import { TheaterMovieRepo } from '../../repos/movie.repo'

@Component({
  selector: 'app-thr-movies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, PageHeaderComponent, MovieCatalogComponent],
  providers: [{ provide: MovieCatalogSource, useExisting: TheaterMovieRepo }],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
      <cs-page-header heading="Movies" description="The CineSnap catalogue. Any of these can be scheduled on your screens.">
        <a csButton routerLink="/theater/shows">Schedule a show</a>
      </cs-page-header>
      <app-movie-catalog class="mt-6 block" />
    </main>
  `
})
export class TheaterMoviesComponent {}
