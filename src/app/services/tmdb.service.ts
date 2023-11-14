/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environments } from 'src/environments/environment';
import { IMovie, IMoviesObj } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class TMDBService {
  tmdbApi = environments.tmdbApi
  tmdbKey = environments.tmdbKey

  constructor (
    private readonly http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Bypass-Interceptor': 'true' })
  }

  fetchMovieByLanguage (lang: string): Observable<IMovie[]> {
    return this.http.get<IMoviesObj>(`${this.tmdbApi}/discover/movie?api_key=${this.tmdbKey}&with_original_language=${lang}&sort_by=release_date.desc`, this.httpOptions).pipe(
      map((result) => result.results.map(movie => ({
        id: movie.id,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        original_title: movie.original_title,
        overview: movie.overview
      })))
    );
  }

  // fetchUpcomingMoviesByLanguage (lang: string): object { // create a movie
  //   return this.http.get(`${this.tmdbApi}/discover/movie?api_key=${this.tmdbKey}&with_original_language=${lang}&primary_release_year=${new Date().getFullYear()}&sort_by=release_date.desc`)
  // }
}

// discover/movie?api_key=THE_KEY&language=en-US&sort_by=popularity.desc&page=1&
