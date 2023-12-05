/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit } from '@angular/core'
import { IFilterEvent, langType } from 'src/app/models/filter'
import { ICSMovieRes } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'

@Component({
  selector: 'app-thr-movies',
  templateUrl: './thr-movies.component.html',
  styleUrls: ['./thr-movies.component.css']
})
export class ThrMoviesComponent implements OnInit {
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
        console.log(res, 'res from findAllMovies')
        this.movies = res.data
        this.filteredMovies = res.data
      }
    })
  }

  filterMovies (event: IFilterEvent): void {
    console.log(event, 'event data')

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
