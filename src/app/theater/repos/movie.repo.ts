import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiFilters, type IFilterEvent } from 'src/app/core/models/filter.model'
import { type IApiCSMoviesRes } from 'src/app/core/models/movie.model'
import { type MovieCatalogSource } from 'src/app/shared/components/movie-catalog/movie-catalog-source'
import { filteredMoviesUrl } from 'src/app/shared/utils/query-string'

/** The backend has no theater routes for the catalogue; theaters read the public user/ ones. */
@Injectable({ providedIn: 'root' })
export class TheaterMovieRepo implements MovieCatalogSource {
  private readonly http = inject(HttpClient)

  findAllMovies (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('user/movies')
  }

  searchMovie (title: string): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(`user/movies?title=${encodeURIComponent(title)}`)
  }

  fetchFilterDatas (): Observable<IApiFilters> {
    return this.http.get<IApiFilters>('user/filters')
  }

  findCineSnapFilteredMovies (filters: IFilterEvent, page: number): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(filteredMoviesUrl(filters, page))
  }
}
