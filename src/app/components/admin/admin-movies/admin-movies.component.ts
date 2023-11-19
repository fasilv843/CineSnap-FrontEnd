/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import { TMDBService } from 'src/app/services/tmdb.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BENGALI, ENGLISH, HINDI, KANNADA, MALAYALAM, TAMIL, TELUGU } from 'src/app/shared/langAbbreviation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-movies',
  templateUrl: './admin-movies.component.html',
  styleUrls: ['./admin-movies.component.css']
})
export class AdminMoviesComponent implements OnInit {
  constructor (
    private readonly tmdbService: TMDBService,
    private readonly movieService: MovieService,
    private readonly router: Router
  ) {}

  searchResultMovies: Movie[] = []
  malayalamMovies: Movie[] = []
  tamilMovies: Movie[] = []
  hindiMovies: Movie[] = []
  // teluguMovies: Movie[] = []
  // kannadaMovies: Movie[] = []
  englishMovies: Movie[] = []
  // bengaliMovies: Movie[] = []

  ngOnInit (): void {
    this.getMalayalmMovies()
    this.getTamilMovies()
    this.getHindiMovies()
    // this.getTeluguMovies()
    // this.getKannadaMovies()
    this.getEnglishMovies()
    // this.getBenaliMovies()
  }

  addMovie (movie: Movie): void {
    this.movieService.saveMovie(movie).subscribe({
      next: async () => await Swal.fire('Success', 'Movie Successfully Added', 'success'),
      error: async (err: { error: { message: string | undefined } }) => await Swal.fire('Error', err.error.message, 'error')
    });
  }

  searchTmdbMovies (title: string): void {
    console.log(title, 'search on tmdb fn')
    this.tmdbService.searchMovieByName(title).subscribe({
      next: (res) => {
        this.searchResultMovies = res
      },
      error: () => {
        void Swal.fire('Sorry :<', 'Didn\'t find searched movie', 'info')
      }
    })
  }

  exploreLanguage (lang: string): void {
    void this.router.navigate(['/admin/movies/', lang])
  }

  getMalayalmMovies (): void {
    this.tmdbService.fetchMovieByLanguage(MALAYALAM).subscribe({
      next: (res) => {
        this.malayalamMovies = res
        console.log(res, 'res mal')
      }
    })
  }

  getTamilMovies (): void {
    this.tmdbService.fetchMovieByLanguage(TAMIL).subscribe({
      next: (res) => {
        this.tamilMovies = res
        console.log(res, 'res, tamil')
      }
    })
  }

  getHindiMovies (): void {
    this.tmdbService.fetchMovieByLanguage(HINDI).subscribe({
      next: (res) => {
        this.hindiMovies = res
      }
    })
  }

  // getTeluguMovies (): void {
  //   this.tmdbService.fetchMovieByLanguage(TELUGU).subscribe({
  //     next: (res) => {
  //       this.teluguMovies = res
  //       // console.log(res, 'res, hindi')
  //     }
  //   })
  // }

  // getKannadaMovies (): void {
  //   this.tmdbService.fetchMovieByLanguage(KANNADA).subscribe({
  //     next: (res) => {
  //       this.kannadaMovies = res
  //       console.log(res, 'res, kannada')
  //     }
  //   })
  // }

  getEnglishMovies (): void {
    this.tmdbService.fetchMovieByLanguage(ENGLISH).subscribe({
      next: (res) => {
        this.englishMovies = res
        console.log(res, 'res, english')
      }
    })
  }

  // getBenaliMovies (): void {
  //   this.tmdbService.fetchMovieByLanguage(BENGALI).subscribe({
  //     next: (res) => {
  //       this.bengaliMovies = res
  //       // console.log(res, 'res, hindi')
  //     }
  //   })
  // }
}

// Remove Unused Languages that imported from constants
