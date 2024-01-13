/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core'
import { SearchComponent } from '../../common/search/search.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent
  ],
  selector: 'app-admin-movies-search',
  templateUrl: './admin-movies-search.component.html',
  styleUrls: ['./admin-movies-search.component.css']
})
export class AdminMoviesSearchComponent {
  @Output() search = new EventEmitter<string>()

  constructor (
    private readonly router: Router
  ) {}

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
