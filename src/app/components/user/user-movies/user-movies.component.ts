/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, type OnInit } from '@angular/core';
import { IFilterEvent, langType } from 'src/app/models/filter';
import { ICSMovieRes } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import Swal from 'sweetalert2';

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

  searchCineSnapMovies (title: string): void {
    console.log('title from cinesnap movies search', title)
    this.movieService.searchMovie(title).subscribe({
      next: (res) => {
        console.log(res, 'responce from search movie')
        if (res.data.length === 0) {
          void Swal.fire('Sorry :<', 'We don\'t have the movie that you are looking for', 'info')
        } else {
          this.filteredMovies = res.data
        }
      }
    })
  }
}
