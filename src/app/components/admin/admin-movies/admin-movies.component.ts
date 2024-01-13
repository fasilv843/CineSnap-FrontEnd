/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import { TMDBService } from 'src/app/services/tmdb.service';
import { Language } from 'src/app/shared/langAbbreviation';
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

  tmdbIds: number[] = []
  searchResultMovies: Movie[] = []
  malayalamMovies: Movie[] = []
  tamilMovies: Movie[] = []
  hindiMovies: Movie[] = []
  teluguMovies: Movie[] = []
  kannadaMovies: Movie[] = []
  englishMovies: Movie[] = []

  ngOnInit (): void {
    this.getMalayalmMovies()
    this.getTamilMovies()
    this.getHindiMovies()
    this.getTeluguMovies()
    this.getKannadaMovies()
    this.getEnglishMovies()

    this.movieService.fetchCineSnapMovies().subscribe({
      next: (res) => {
        this.tmdbIds = res.data
      }
    })
  }

  isMovieAlreadyExist (tmdbId: number): boolean {
    return this.tmdbIds.includes(tmdbId);
  }

  addMovie (movie: Movie): void {
    this.movieService.saveMovie(movie).subscribe({
      next: async () => await Swal.fire('Success', 'Movie Successfully Added', 'success')
    });
  }

  searchTmdbMovies (title: string): void {
    console.log(title, 'search on tmdb fn')
    this.tmdbService.searchMovieByName(title).subscribe({
      next: (res) => {
        this.searchResultMovies = res
      }
    })
  }

  exploreLanguage (lang: string): void {
    void this.router.navigate(['/admin/movies/', lang])
  }

  getMalayalmMovies (): void {
    this.tmdbService.fetchMovieByLanguage(Language.MALAYALAM).subscribe({
      next: (res) => {
        this.malayalamMovies = res
      }
    })
  }

  getTamilMovies (): void {
    this.tmdbService.fetchMovieByLanguage(Language.TAMIL).subscribe({
      next: (res) => {
        this.tamilMovies = res
      }
    })
  }

  getHindiMovies (): void {
    this.tmdbService.fetchMovieByLanguage(Language.HINDI).subscribe({
      next: (res) => {
        this.hindiMovies = res
      }
    })
  }

  getTeluguMovies (): void {
    this.tmdbService.fetchMovieByLanguage(Language.TELUGU).subscribe({
      next: (res) => {
        this.teluguMovies = res
      }
    })
  }

  getKannadaMovies (): void {
    this.tmdbService.fetchMovieByLanguage(Language.KANNADA).subscribe({
      next: (res) => {
        this.kannadaMovies = res
      }
    })
  }

  getEnglishMovies (): void {
    this.tmdbService.fetchMovieByLanguage(Language.ENGLISH).subscribe({
      next: (res) => {
        this.englishMovies = res
      }
    })
  }
}
