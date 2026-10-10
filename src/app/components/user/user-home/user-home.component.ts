/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit, ChangeDetectionStrategy, inject, effect, Injector } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { getGenre, getGenreId, getLanguage, getLanguageAbbr } from 'src/app/helpers/movie'
// import { type ICSMovieRes } from 'src/app/models/movie'
import { type ITheaterRes } from 'src/app/models/theater'
import { MovieService } from 'src/app/services/movie.service'
import { TheaterService } from 'src/app/services/theater.service'
import { saveCoords } from 'src/app/states/coords/coords.actions'
import { selectCoords } from 'src/app/states/coords/coords.selector'
import { ICarouselData, CarouselComponent } from './carousel/carousel.component'
import { UserNavComponent } from '../user-nav/user-nav.component';
import { ScrollHTabsComponent } from '../../common/scroll-h-tabs/scroll-h-tabs.component';

@Component({
    selector: 'app-user-home',
    templateUrl: './user-home.component.html',
    styleUrls: ['./user-home.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UserNavComponent, CarouselComponent, ScrollHTabsComponent]
})
export class UserHomeComponent implements OnInit {
  private readonly movieService = inject(MovieService)
  private readonly injector = inject(Injector)
  private readonly theaterService = inject(TheaterService)
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  coords = this.store.selectSignal(selectCoords)
  bannerMovies: ICarouselData[] = []
  active = 1
  languages: string[] = []
  genres: string[] = []
  theaters: ITheaterRes[] = []
  theaterNames: string[] = []

  getLanguage = getLanguage
  getGenre = getGenre
  getGenreId = getGenreId
  getLanguageAbbr = getLanguageAbbr

  constructor () {
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
        console.log(res.data, 'res.data from bannerMovies')
        this.bannerMovies = res.data.map(movie => {
          return {
            imageUrl: 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path,
            title: movie.title
          }
        })
      }
    })

    this.movieService.fetchFilterDatas().subscribe({
      next: (res) => {
        console.log(res, 'res from filter component')
        this.languages = res.languages.map(l => getLanguage(l))
        this.genres = res.genres.map(g => getGenre(g))
      }
    })

    effect(() => {
      const coords = this.coords()
      if (coords !== null) {
        const lon = coords.coordinates[0]
        const lat = coords.coordinates[1]
        this.theaterService.getNearestTheaters(lon, lat).subscribe({
          next: (res) => {
            console.log(res, 'nearest theater response')
            this.theaters = res.data
            this.theaterNames = this.theaters.map(t => t.name)
          }
        })
      } else {
        console.log('coords not available now')
      }
    }, { injector: this.injector })
  }

  onClickGenre (genre: string): void {
    const genreId = getGenreId(genre)
    console.log(genreId, 'genreId')
    void this.router.navigate(['/user/movies'], {
      queryParams: { genreId }
    })
  }

  onClickLanguage (language: string): void {
    console.log(language, 'language from labels event')
    const langAbbr = getLanguageAbbr(language)
    void this.router.navigate(['/user/movies'], {
      queryParams: { langAbbr }
    })
  }

  onClickTheaterName (theaterName: string): void {
    const theater = this.theaters.find(t => t.name === theaterName)
    if (theater !== undefined) void this.router.navigate(['/user/theater', theater._id])
  }

  setActive (index: number): void {
    this.active = index
  }
}
