/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, type OnInit } from '@angular/core';
import { type IMovie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.css']
})
export class UserMoviesComponent implements OnInit {
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
        console.log(res, 'res from findAllMovies');
        this.movies = res.movies
      },
      error: (err) => {
        void Swal.fire('Error', err.error.message, 'error')
      }
    })
  }
}
