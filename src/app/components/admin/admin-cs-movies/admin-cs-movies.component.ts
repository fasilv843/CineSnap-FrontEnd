/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { IMovie } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-cs-movies',
  templateUrl: './admin-cs-movies.component.html',
  styleUrls: ['./admin-cs-movies.component.css']
})
export class AdminCsMoviesComponent {
  movies: IMovie[] = []

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
        this.movies = res.movies
      },
      error: (err) => {
        void Swal.fire('Error', err.error.message, 'error')
      }
    })
  }

  searchCineSnapMovies (title: string): void {
    console.log('title from cinesnap movies search', title)
    this.movieService.searchMovie(title).subscribe({
      next: (res) => {
        console.log(res, 'responce from search movie')
        if (res.movies.length === 0) {
          void Swal.fire('Sorry :<', 'We don\'t have the movie that you are looking for', 'info')
        } else {
          this.movies = res.movies
        }
      },
      error: () => {
        void Swal.fire('Sorry :<', 'Didn\'t find searched movie', 'info')
      }
    })
  }
}
