/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ElementRef, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FilterComponent } from '../filter/filter.component'
import { SearchComponent } from '../search/search.component'
import { type IFilterEvent } from 'src/app/models/filter'
import { type ICSMovieRes } from 'src/app/models/movie'
import { SpinnerComponent } from '../spinner/spinner.component'
import { MovieService } from 'src/app/services/movie.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cs-movies',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    SearchComponent,
    SpinnerComponent
  ],
  templateUrl: './cs-movies.component.html',
  styleUrls: ['./cs-movies.component.css']
})
export class CsMoviesComponent {
  movies: ICSMovieRes[] = []
  page: number = 1
  isCompleted = false
  isLoading = true
  scrollDistance = 5
  movieFilter: IFilterEvent = {
    availability: 'Available',
    filterGenres: [],
    filterLanguages: []
  }

  constructor (
    private readonly movieService: MovieService,
    private readonly el: ElementRef
  ) {}

  @HostListener('window:scroll', ['$event'])
  onScroll (): void {
    if (!this.isLoading && !this.isCompleted && this.isAtBottom()) {
      this.isLoading = true
      console.log('loading true, finding movies')
      this.findCineSnapMovies()
    }
  }

  ngOnInit (): void {
    this.findCineSnapMovies()
  }

  findCineSnapMovies (): void {
    this.movieService.findCineSnapFilteredMovies(this.movieFilter, this.page).subscribe({
      next: (res) => {
        console.log(res, 'res from findCineSnapFilteredMovies()')
        if (this.page !== 1) this.movies = this.movies.concat(res.data)
        else this.movies = res.data
        this.isLoading = false
        this.page++
        if (res.data.length < 10) this.isCompleted = true
      },
      error: () => {
        this.isLoading = false
      }
    })
  }

  filterMovies (filters: IFilterEvent): void {
    console.log(filters, 'event data')
    this.page = 1
    filters.availability = 'Available'
    this.movieFilter = filters
    this.isLoading = true
    this.findCineSnapMovies()
  }

  searchCineSnapMovies (title: string): void {
    console.log('title from cinesnap movies search', title)
    this.movieService.searchMovie(title).subscribe({
      next: (res) => {
        console.log(res, 'responce from search movie')
        if (res.data.length === 0) {
          void Swal.fire('Sorry :<', 'We don\'t have the movie that you are looking for', 'info')
        } else {
          this.movies = res.data
        }
      }
    })
  }

  private isAtBottom (): boolean {
    // Implement your logic to check if the user is at the bottom
    const scrollContainer = this.el.nativeElement
    const scrollHeight = scrollContainer.scrollHeight
    const scrollTop = scrollContainer.scrollTop
    const clientHeight = scrollContainer.clientHeight

    return scrollTop + clientHeight >= scrollHeight - this.scrollDistance
  }
}
