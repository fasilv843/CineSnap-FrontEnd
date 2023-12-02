/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core';
import { IApiCSMovieRes, IApiCSMoviesRes, Movie } from '../models/movie';
import { HttpClient } from '@angular/common/http';
import { type Observable } from 'rxjs';

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

  findAllMoviesByAdmin (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('admin/movies')
  }

  // findMoviesByGenre (genreId: string) {

  // }

  // findMovieByLanguage (lang: string){

  // }

  searchMovie (title: string): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>(`user/movies?title=${title}`)
  }

  deleteMovie (movieId: string): Observable<IApiCSMovieRes> {
    return this.http.patch<IApiCSMovieRes>(`admin/movies/delete/${movieId}`, {})
  }

  getBannerMovies (): Observable<IApiCSMoviesRes> {
    return this.http.get<IApiCSMoviesRes>('user/banner')
  }
}
