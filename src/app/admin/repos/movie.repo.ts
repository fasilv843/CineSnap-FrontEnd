import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiFilters, type IFilterEvent } from 'src/app/core/models/filter.model'
import { type IApiCSMovieRes, type IApiCSMoviesRes, type Movie } from 'src/app/core/models/movie.model'
import { type MovieCatalogSource } from 'src/app/shared/components/movie-catalog/movie-catalog-source'
import { filteredMoviesUrl } from 'src/app/shared/utils/query-string'

@Injectable({ providedIn: 'root' })
export class AdminMovieRepo implements MovieCatalogSource {
  private readonly http = inject(HttpClient)

  saveMovie (movie: Movie): Observable<IApiCSMovieRes> {
    return this.http.post<IApiCSMovieRes>('admin/movies/add', { movie })
  }

  findAllMoviesByAdmin (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('admin/movies')
  }

  searchMovie (title: string): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(`admin/movies?title=${encodeURIComponent(title)}&isAdmin=true`)
  }

  /** Toggles: removes a listed movie, restores a removed one */
  deleteMovie (movieId: string): Observable<IApiCSMovieRes> {
    return this.http.patch<IApiCSMovieRes>(`admin/movies/delete/${movieId}`, {})
  }

  /** TMDB ids already in the CineSnap catalogue */
  fetchCineSnapMovies (): Observable<{ status: number, message: string, data: number[] }> {
    return this.http.get<{ status: number, message: string, data: number[] }>('admin/csmovies/get')
  }

  // The backend has no admin routes for filtering the catalogue; the public user/ ones serve it.
  fetchFilterDatas (): Observable<IApiFilters> {
    return this.http.get<IApiFilters>('user/filters')
  }

  findCineSnapFilteredMovies (filters: IFilterEvent, page: number): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(filteredMoviesUrl(filters, page))
  }
}
