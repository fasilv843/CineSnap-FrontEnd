/* eslint-disable no-void */
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

  deleteMovie (movieId: string, action: 'Add' | 'Delete'): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this movie!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.isConfirmed) {
        this.movieService.deleteMovie(movieId).subscribe({
          next: () => {
            const movieIndex = this.movies.findIndex(movie => movie._id === movieId)
            this.movies = [
              ...this.movies.slice(0, movieIndex),
              { ...this.movies[movieIndex], isDeleted: !(this.movies[movieIndex].isDeleted ?? false) },
              ...this.movies.slice(movieIndex + 1)
            ]
          }
        })
      }
    })
  }

  findCineSnapMovies (): void {
    this.movieService.findAllMoviesByAdmin().subscribe({
      next: (res) => {
        console.log(res, 'res from findAllMovies')
        this.movies = res.movies
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
      }
    })
  }
}
