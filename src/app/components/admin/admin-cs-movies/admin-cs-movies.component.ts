/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { DataServiceService } from 'src/app/services/data-service.service'
import { MovieService } from 'src/app/services/movie.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-cs-movies',
  templateUrl: './admin-cs-movies.component.html',
  styleUrls: ['./admin-cs-movies.component.css'],
  providers: [DataServiceService]
})
export class AdminCsMoviesComponent {
  constructor (
    private readonly movieService: MovieService,
    private readonly dataService: DataServiceService
  ) {}

  deleteMovie (movieData: { movieId: string, action: 'Add' | 'Delete' }): void {
    const { movieId, action } = movieData
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
            console.warn('Movie deleted or added successfully')
            this.dataService.emitData(movieId)
          }
        })
      }
    })
  }
}
