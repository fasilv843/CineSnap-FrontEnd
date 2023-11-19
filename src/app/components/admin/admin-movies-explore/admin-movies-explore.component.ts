/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IMovie } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'
import { TMDBService } from 'src/app/services/tmdb.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-movies-explore',
  templateUrl: './admin-movies-explore.component.html',
  styleUrls: ['./admin-movies-explore.component.css']
})
export class AdminMoviesExploreComponent implements OnInit {
  routeParam: string = ''
  movies: IMovie[] = []
  page: number = 1

  constructor (
    private readonly route: ActivatedRoute,
    private readonly tmdbService: TMDBService,
    private readonly movieService: MovieService
  ) { }

  ngOnInit (): void {
    this.routeParam = this.route.snapshot.paramMap.get('lang') ?? 'ml'
    this.exploreLanguage(this.routeParam)
  }

  loadMore (): void {
    this.exploreLanguage(this.routeParam)
  }

  addMovie (movie: IMovie): void {
    this.movieService.saveMovie(movie).subscribe({
      next: async () => await Swal.fire('Success', 'Movie Successfully Added', 'success'),
      error: async (err: { error: { message: string | undefined } }) => await Swal.fire('Error', err.error.message, 'error')
    })
  }

  exploreLanguage (lang: string): void {
    this.tmdbService.fetchMovieByLanguage(lang, this.page).subscribe({
      next: (res) => {
        this.movies = [...this.movies, ...res]
        this.page++
      },
      error: (err) => {
        void Swal.fire('Error', err.error.message, 'error')
      }
    })
  }
}