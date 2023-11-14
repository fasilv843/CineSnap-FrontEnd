/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
import { IMovie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import { TMDBService } from 'src/app/services/tmdb.service';
import { HINDI, MALAYALAM, TAMIL } from 'src/app/shared/langAbbreviation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-movies',
  templateUrl: './admin-movies.component.html',
  styleUrls: ['./admin-movies.component.css']
})
export class AdminMoviesComponent implements OnInit {
  constructor (
    private readonly tmdbService: TMDBService,
    private readonly movieService: MovieService
  ) {}

  malayalamMovies: IMovie[] = []
  tamilMovies: IMovie[] = []
  hindiMovies: IMovie[] = []

  ngOnInit (): void {
    this.getMalayalmMovies()
    this.getTamilMovies()
    this.getHindiMovies()
  }

  addMovie (movie: IMovie): void {
    this.movieService.saveMovie(movie).subscribe({
      next: async () => await Swal.fire('Success', 'Movie Successfully Added', 'success'),
      error: async (err: { error: { message: string | undefined } }) => await Swal.fire('Error', err.error.message, 'error')
    });
  }

  getMalayalmMovies (): void {
    this.tmdbService.fetchMovieByLanguage(MALAYALAM).subscribe({
      next: (res) => {
        this.malayalamMovies = res
        console.log(res)
      }
    })
  }

  getTamilMovies (): void {
    this.tmdbService.fetchMovieByLanguage(TAMIL).subscribe({
      next: (res) => {
        this.tamilMovies = res
        console.log(res)
      }
    })
  }

  getHindiMovies (): void {
    this.tmdbService.fetchMovieByLanguage(HINDI).subscribe({
      next: (res) => {
        this.hindiMovies = res
        console.log(res)
      }
    })
  }
}
