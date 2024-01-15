/* eslint-disable @typescript-eslint/consistent-type-imports */
// import { type HttpClient } from '@angular/common/http';
import { Component, Inject, type OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { Subject, takeUntil } from 'rxjs'
import { getGenre, getLanguage } from 'src/app/helpers/movie'
import { type genreType, type langType } from 'src/app/models/filter'
import { type ICSMovieRes } from 'src/app/models/movie'
import { type ITheaterRes } from 'src/app/models/theater'
import { DataServiceService } from 'src/app/services/data-service.service'
import { MovieService } from 'src/app/services/movie.service'
import { TheaterService } from 'src/app/services/theater.service'
import { saveCoords } from 'src/app/states/coords/coords.actions'
import { selectCoords } from 'src/app/states/coords/coords.selector'

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  coords$ = this.store.pipe(select(selectCoords))
  bannerMovies: ICSMovieRes[] = []
  active = 1
  languages: langType[] = []
  genres: genreType[] = []
  theaters: ITheaterRes[] = []
  unsubscribe$ = new Subject<void>()

  getLanguage = getLanguage
  getGenre = getGenre

  constructor (
    @Inject(MovieService) private readonly movieService: MovieService,
    @Inject(TheaterService) private readonly theaterService: TheaterService,
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router
  ) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lon = position.coords.longitude
        const lat = position.coords.latitude
        this.store.dispatch(saveCoords({ coords: { coordinates: [lon, lat] } }))
      })
    } else {
      console.log('No support for geolocation')
    }
  }

  ngOnInit (): void {
    this.movieService.getBannerMovies().subscribe({
      next: (res) => {
        console.log(res.data, 'res.data from bannermvooeis')
        this.bannerMovies = res.data
      }
    })

    this.movieService.fetchFilterDatas().subscribe({
      next: (res) => {
        console.log(res, 'res from filter component')
        this.languages = res.languages
        this.genres = res.genres
      }
    })

    this.coords$.pipe(takeUntil(this.unsubscribe$)).subscribe((coords) => {
      if (coords !== null) {
        const lon = coords.coordinates[0]
        const lat = coords.coordinates[1]
        this.theaterService.getNearestTheaters(lon, lat).subscribe({
          next: (res) => {
            console.log(res, 'nearest theater response')
            this.theaters = res.data
          }
        })
      } else {
        console.log('coords not available now')
      }
    })
  }

  moviesWithGenre (genre: genreType): void {
    // void this.router.navigate(['/user/movies', genre])
  }

  moviesWithLanguage (language: langType): void {
    // void this.router.navigate(['/user/movies', language])
  }

  openTheaterPage (theaterId: string): void {
    void this.router.navigate(['/user/theater', theaterId])
  }

  setActive (index: number): void {
    this.active = index
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
