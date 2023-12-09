// import { type HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core'
import { type ICSMovieRes } from 'src/app/models/movie'
import { MovieService } from 'src/app/services/movie.service'

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  bannerMovies: ICSMovieRes[] = []
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (
    @Inject(MovieService) private readonly movieService: MovieService
  ) {}

  ngOnInit (): void {
    this.movieService.getBannerMovies().subscribe({
      next: (res) => {
        console.log(res.data, 'res.data from bannermvooeis')
        this.bannerMovies = res.data
      }
    })
  }
}
