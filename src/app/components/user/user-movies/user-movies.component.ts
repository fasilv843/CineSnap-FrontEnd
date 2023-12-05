/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, type OnInit } from '@angular/core';
import { IFilterEvent, langType } from 'src/app/models/filter';
import { ICSMovieRes } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.css']
})
export class UserMoviesComponent implements OnInit {
  movies: ICSMovieRes[] = []
  filteredMovies: ICSMovieRes[] = []

  constructor (
    private readonly movieService: MovieService
  ) {}

  ngOnInit (): void {
    this.findCineSnapMovies()
  }

  findCineSnapMovies (): void {
    this.movieService.findAllMovies().subscribe({
      next: (res) => {
        console.log(res, 'res from findAllMovies');
        this.movies = res.data
        this.filteredMovies = res.data
      }
    })
  }

  filterMovies (event: IFilterEvent): void {
    console.log(event, 'event data');

    this.filteredMovies = this.movies.filter(movie => {
      return (
        (
          event.filterGenres.some(genreId => movie.genre_ids.includes(genreId)) ||
          event.filterGenres.length === 0
        ) &&
        (
          event.filterLanguages.includes(movie.language as langType) ||
          event.filterLanguages.length === 0
        )
      )
    })
  }
}
