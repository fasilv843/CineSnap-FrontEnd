/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FilterComponent } from '../filter/filter.component'
import { SearchComponent } from '../search/search.component'
import { langType, type IFilterEvent } from 'src/app/models/filter'
import { type ICSMovieRes } from 'src/app/models/movie'
import { SpinnerComponent } from '../spinner/spinner.component'
import { MovieService } from 'src/app/services/movie.service'
import { AdminMoviesSearchComponent } from '../../admin/admin-movies-search/admin-movies-search.component'
import { DataServiceService } from 'src/app/services/data-service.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-cs-movies',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    SearchComponent,
    SpinnerComponent,
    AdminMoviesSearchComponent
  ],
  templateUrl: './cs-movies.component.html',
  styleUrls: ['./cs-movies.component.css']
})
export class CsMoviesComponent implements OnInit, OnDestroy {
  @Input() isAdmin = false
  @Input() genreId: number | undefined
  @Input() language: langType | undefined
  @Output() deleteMovieEvent = new EventEmitter<{ movieId: string, action: 'Add' | 'Delete' }>()
  movies: ICSMovieRes[] = []
  page: number = 1
  isCompleted = false
  isLoading = true
  scrollDistance = 5
  // Show filter for small screens
  showFilter = false
  movieFilter: IFilterEvent = {
    availability: 'Available',
    filterGenres: [],
    filterLanguages: []
  }

  showSpellingError = false
  private dataServiceSubscription!: Subscription

  @HostBinding() isLargeScreen = window.innerWidth > 768

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize (): void {
    // Update variable name based on screen size
    this.isLargeScreen = window.innerWidth > 768
    console.log('resizing', this.isLargeScreen)
  }

  constructor (
    private readonly movieService: MovieService,
    private readonly el: ElementRef,
    private readonly dataService: DataServiceService
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
    this.movieFilter.availability = this.isAdmin ? 'All' : 'Available'
    if (this.genreId !== undefined) {
      this.movieFilter.filterGenres.push(this.genreId)
    }
    if (this.language !== undefined) {
      this.movieFilter.filterLanguages.push(this.language)
    }
    console.log(this.genreId, 'genreId')
    console.log(this.language, 'language')
    console.log(this.movieFilter, 'movie filter')

    this.findCineSnapMovies()
    this.dataServiceSubscription = this.dataService.getCurrentData().subscribe(id => {
      this.movies = this.movies.map(movie => id === movie._id ? { ...movie, isDeleted: !movie.isDeleted } : movie)
    })
  }

  ngOnDestroy (): void {
    this.dataServiceSubscription.unsubscribe()
  }

  toggleFilter (): void {
    this.showFilter = !this.showFilter
  }

  deleteMovie (movieId: string, action: 'Add' | 'Delete'): void {
    if (this.isAdmin) {
      this.deleteMovieEvent.emit({ movieId, action })
    }
  }

  findCineSnapMovies (): void {
    this.showSpellingError = false
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
    this.movieFilter = filters
    this.isLoading = true
    this.findCineSnapMovies()
  }

  searchCineSnapMovies (title: string): void {
    console.log('title from cinesnap movies search', title)
    this.movieService.searchMovie(title, this.isAdmin).subscribe({
      next: (res) => {
        console.log(res, 'responce from search movie')
        if (res.data.length === 0) {
          // void Swal.fire('Sorry :<', 'We don\'t have the movie that you are looking for', 'info')
          this.showSpellingError = true
        } else {
          this.showSpellingError = false
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
