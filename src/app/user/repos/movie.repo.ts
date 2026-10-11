import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiFilters, type IFilterEvent } from 'src/app/core/models/filter.model'
import { type IApiCSMovieRes, type IApiCSMoviesRes } from 'src/app/core/models/movie.model'
import { filteredMoviesUrl } from 'src/app/shared/utils/query-string'

@Injectable({ providedIn: 'root' })
export class UserMovieRepo {
  private readonly http = inject(HttpClient)

  findMovieById (movieId: string): Observable<IApiCSMovieRes> {
    return this.http.get<IApiCSMovieRes>(`user/movies/get/${movieId}`)
  }

  findCineSnapFilteredMovies (filters: IFilterEvent, page: number): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(filteredMoviesUrl(filters, page))
  }

  searchMovie (title: string): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(`user/movies?title=${encodeURIComponent(title)}`)
  }

  getBannerMovies (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('user/banner')
  }

  fetchFilterDatas (): Observable<IApiFilters> {
    return this.http.get<IApiFilters>('user/filters')
  }
}
