/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { IFilterEvent, langType } from 'src/app/models/filter'
import { ICSMovieRes } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-cs-movies',
  templateUrl: './admin-cs-movies.component.html',
  styleUrls: ['./admin-cs-movies.component.css']
})
export class AdminCsMoviesComponent {
  movies: ICSMovieRes[] = []
  filteredMovies: ICSMovieRes[] = []

  constructor (
    private readonly movieService: MovieService
  ) {}

  ngOnInit (): void {
    this.findCineSnapMovies()
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
        ) &&
        (
          event.availability === 'All' ||
          (event.availability === 'Available' && !movie.isDeleted) ||
          (event.availability === 'Deleted' && movie.isDeleted)
        )
      )
    })
  }

  // filterMovies (event: IFilterEvent): void {
  //   console.log(event, 'filter applied event from admin cs movies')
  //   this.filteredMovies = this.movies.filter(movie => {
  //     return event.filterGenres.some(genreId => movie.genre_ids.includes(genreId))
  //   }).filter(movie => event.filterLanguages.includes(movie.language as langType))
  //     .filter(movie => {
  //       switch (event.availability) {
  //         case 'All':
  //           return true
  //         case 'Available':
  //           return !movie.isDeleted
  //         case 'Deleted':
  //           return movie.isDeleted
  //         default:
  //           console.log('new value for availability')
  //           return true
  //       }
  //     })
  // }

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
            const movieIndex = this.filteredMovies.findIndex(movie => movie._id === movieId)
            this.filteredMovies = [
              ...this.filteredMovies.slice(0, movieIndex),
              { ...this.filteredMovies[movieIndex], isDeleted: !(this.filteredMovies[movieIndex].isDeleted ?? false) },
              ...this.filteredMovies.slice(movieIndex + 1)
            ]
            const allMovieIndex = this.movies.findIndex(movie => movie._id === movieId)
            this.movies[allMovieIndex].isDeleted = !this.movies[allMovieIndex].isDeleted
          }
        })
      }
    })
  }

  findCineSnapMovies (): void {
    this.movieService.findAllMoviesByAdmin().subscribe({
      next: (res) => {
        console.log(res, 'res from findAllMovies')
        this.movies = res.data
        this.filteredMovies = this.movies
      }
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
