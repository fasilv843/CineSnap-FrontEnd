/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core';
import { CSMovieRes, Movie } from '../models/movie';
import { HttpClient } from '@angular/common/http';
import { type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor (
    private readonly http: HttpClient
  ) { }

  saveMovie (movie: Movie): Observable<any> {
    return this.http.post('admin/movies/add', { movie })
  }

  findAllMovies (): Observable<CSMovieRes> {
    return this.http.get<CSMovieRes>('user/movies')
  }

  findAllMoviesByAdmin (): Observable<CSMovieRes> {
    return this.http.get<CSMovieRes>('admin/movies')
  }

  // findMoviesByGenre (genreId: string) {

  // }

  // findMovieByLanguage (lang: string){

  // }

  searchMovie (title: string): Observable<CSMovieRes> {
    return this.http.get<CSMovieRes>(`user/movies?title=${title}`)
  }

  deleteMovie (movieId: string): Observable<CSMovieRes> {
    return this.http.patch<CSMovieRes>(`admin/movies/delete/${movieId}`, {})
  }
}
