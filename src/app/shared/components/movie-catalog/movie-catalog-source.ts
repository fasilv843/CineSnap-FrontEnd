import { type Observable } from 'rxjs'
import { type IApiFilters, type IFilterEvent } from 'src/app/core/models/filter.model'
import { type IApiCSMovieRes, type IApiCSMoviesRes } from 'src/app/core/models/movie.model'

/**
 * Where <app-movie-catalog> loads movies from. The page that hosts the catalogue provides its section's movie repo:
 * `providers: [{ provide: MovieCatalogSource, useExisting: AdminMovieRepo }]`
 * A source that can delete movies turns on manage mode: removed movies are listed too, with Remove / Restore.
 */
export abstract class MovieCatalogSource {
  abstract fetchFilterDatas (): Observable<IApiFilters>
  abstract findCineSnapFilteredMovies (filters: IFilterEvent, page: number): Observable<IApiCSMoviesRes>
  abstract searchMovie (title: string): Observable<IApiCSMoviesRes>
  deleteMovie? (movieId: string): Observable<IApiCSMovieRes>
}
