/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit, ChangeDetectionStrategy, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Movie } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'
import { TMDBService } from 'src/app/services/tmdb.service'
import Swal from 'sweetalert2'
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-admin-movies-explore',
    templateUrl: './admin-movies-explore.component.html',
    styleUrls: ['./admin-movies-explore.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AdminNavComponent, DatePipe]
})
export class AdminMoviesExploreComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly tmdbService = inject(TMDBService)
  private readonly movieService = inject(MovieService)

  routeParam: string = ''
  movies: Movie[] = []
  page: number = 1
  tmdbIds: number[] = []

  ngOnInit (): void {
    this.routeParam = this.route.snapshot.paramMap.get('lang') ?? 'ml'
    this.exploreLanguage(this.routeParam)

    this.movieService.fetchCineSnapMovies().subscribe({
      next: (res) => {
        this.tmdbIds = res.data
      }
    })
  }

  isMovieAlreadyExist (tmdbId: number): boolean {
    return this.tmdbIds.includes(tmdbId)
  }

  loadMore (): void {
    this.exploreLanguage(this.routeParam)
  }

  addMovie (movie: Movie): void {
    this.movieService.saveMovie(movie).subscribe({
      next: async () => await Swal.fire('Success', 'Movie Successfully Added', 'success')
    })
  }

  exploreLanguage (lang: string): void {
    this.tmdbService.fetchMovieByLanguage(lang, this.page).subscribe({
      next: (res) => {
        this.movies = [...this.movies, ...res]
        this.page++
      }
    })
  }
}
