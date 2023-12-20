/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, ElementRef, HostListener, type OnInit } from '@angular/core';
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
  page: number = 1
  isCompleted = false
  isLoading = true
  scrollDistance = 10;

  constructor (
    private readonly movieService: MovieService,
    private readonly el: ElementRef
  ) {}

  @HostListener('window:scroll', ['$event'])
  onScroll (): void {
    if (!this.isLoading && !this.isCompleted && this.isAtBottom()) {
      this.isLoading = true
      console.log('loading true, finding movies')
      this.findCineSnapMovies(this.page);
    }
  }

  ngOnInit (): void {
    this.findCineSnapMovies(this.page)
  }

  findCineSnapMovies (page: number): void {
    this.movieService.findAllCSMovies(page).subscribe({
      next: (res) => {
        console.log(res, 'res from findAllMovies');
        this.movies = this.movies.concat(res.data)
        // this.filteredMovies = this.filteredMovies.concat(res.data)
        this.page++
        if (res.data.length < 10) this.isCompleted = true
      },
      complete: () => {
        console.log('movie fetching complete, loading false')
        this.isLoading = false
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

  private isAtBottom (): boolean {
    // Implement your logic to check if the user is at the bottom
    const scrollContainer = this.el.nativeElement;
    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight = scrollContainer.clientHeight;

    return scrollTop + clientHeight >= scrollHeight - this.scrollDistance;
  }
}
