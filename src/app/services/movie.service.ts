/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core';
import { IApiCSMovieRes, IApiCSMoviesRes, Movie } from '../models/movie';
import { HttpClient } from '@angular/common/http';
import { type Observable } from 'rxjs';
import { IApiFilters, IFilterEvent } from '../models/filter';
import { getGenreQuery, getLanguageQuery } from '../helpers/getQueryStr';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor (
    private readonly http: HttpClient
  ) { }

  saveMovie (movie: Movie): Observable<IApiCSMovieRes> {
    return this.http.post<IApiCSMovieRes>('admin/movies/add', { movie })
  }

  findAllMovies (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('user/movies')
  }

  // findAllCSMovies (page: number): Observable<IApiCSMoviesRes> {
  //   return this.http.get<IApiCSMoviesRes>(`user/movies?page=${page}`) // Copy of findAllMovies but with page
  // }

  findAllMoviesByAdmin (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('admin/movies')
  }

  findCineSnapFilteredMovies (filters: IFilterEvent, page: number): Observable<IApiCSMoviesRes> {
    let url = `user/movies?page=${page}`
    const genreStr = getGenreQuery(filters.filterGenres)
    const languageStr = getLanguageQuery(filters.filterLanguages)

    if (genreStr !== '') url += '&' + genreStr
    if (languageStr !== '') url += '&' + languageStr

    console.warn(url, 'url that passing to backend for filtering');
    return this.http.get<IApiCSMoviesRes>(url)
  }

  // findMoviesByGenre (genreId: string) {

  // }

  // findMovieByLanguage (lang: string){

  // }

  searchMovie (title: string): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(`user/movies?title=${title}`)
  }

  deleteMovie (movieId: string): Observable<IApiCSMovieRes> {
    console.log(movieId);
    return this.http.patch<IApiCSMovieRes>(`admin/movies/delete/${movieId}`, {})
  }

  getBannerMovies (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('user/banner')
  }

  fetchCineSnapMovies (): Observable<{ status: number, message: string, data: number[] }> {
    return this.http.get<{ status: number, message: string, data: number[] }>('admin/csmovies/get')
  }

  fetchFilterDatas (): Observable<IApiFilters> {
    console.log('fetching data for filtering');
    return this.http.get<IApiFilters>('user/filters')
  }
}
