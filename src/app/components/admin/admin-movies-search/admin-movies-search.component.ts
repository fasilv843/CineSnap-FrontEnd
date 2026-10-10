/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */

import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core'
import { SearchComponent } from '../../common/search/search.component';
import { Router } from '@angular/router';

@Component({
    imports: [
    SearchComponent
],
    selector: 'app-admin-movies-search',
    templateUrl: './admin-movies-search.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./admin-movies-search.component.css']
})
export class AdminMoviesSearchComponent {
  private readonly router = inject(Router);

  readonly search = output<string>();

  showTmdbMovies (): void {
    void this.router.navigate(['/admin/movies/tmdb'])
  }

  showCineSnapMovies (): void {
    void this.router.navigate(['/admin/movies/cinesnap'])
  }

  onSearch (movieName: string): void {
    this.search.emit(movieName);
  }
}
