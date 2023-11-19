/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environments } from 'src/environments/environment';
import { Movie, IMoviesObj } from '../models/movie';

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

  fetchMovieByLanguage (lang: string, page: number = 2): Observable<Movie[]> {
    return this.http.get<IMoviesObj>(`${this.tmdbApi}/discover/movie?api_key=${this.tmdbKey}&with_original_language=${lang}&sort_by=release_date.desc&page=${page}`, this.httpOptions).pipe(
      map((result) => result.results
        .filter(movie => movie.poster_path)
        .map(movie => ({
          tmdbId: movie.id,
          title: movie.title,
          original_title: movie.original_title,
          language: movie.original_language,
          release_date: new Date(movie.release_date),
          genre_ids: movie.genre_ids,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview
        })))
    );
  }

  searchMovieByName (movieTitle: string): Observable<Movie[]> {
    return this.http.get<IMoviesObj>(`${this.tmdbApi}/search/movie?query=${movieTitle}&api_key=${this.tmdbKey}`, this.httpOptions).pipe(
      map((result) => result.results
        .filter(movie => movie.poster_path)
        .map(movie => ({
          tmdbId: movie.id,
          title: movie.title,
          original_title: movie.original_title,
          language: movie.original_language,
          release_date: new Date(movie.release_date),
          genre_ids: movie.genre_ids,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview
        }))
      )
    );
  }

  fetchMoviesByGenreId (genreId: number): Observable<Movie[]> {
    return this.http.get<IMoviesObj>(`${this.tmdbApi}discover/movie?with_genres=${genreId}&api_key=${this.tmdbKey}`, this.httpOptions).pipe(
      map((result) => result.results
        .filter(movie => movie.poster_path)
        .map(movie => ({
          tmdbId: movie.id,
          title: movie.title,
          original_title: movie.original_title,
          language: movie.original_language,
          release_date: new Date(movie.release_date),
          genre_ids: movie.genre_ids,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview
        }))
      )
    );
  }

  // fetchUpcomingMoviesByLanguage (lang: string): object { // create a movie
  //   return this.http.get(`${this.tmdbApi}/discover/movie?api_key=${this.tmdbKey}&with_original_language=${lang}&primary_release_year=${new Date().getFullYear()}&sort_by=release_date.desc`)
  // }
}

// discover/movie?api_key=THE_KEY&language=en-US&sort_by=popularity.desc&page=1&

// ttps://api.themoviedb.org/3/discover/movie?api_key=###&page=1
// https://api.themoviedb.org/3/discover/movie?api_key=###&page=2
// https://api.themoviedb.org/3/discover/movie?api_key=###&page=3

// //get movie details
// getMovieDetails(movieId: number):Observable<Movie> {
//   return this.http.get<Movie>(`movie/${movieId}?api_key=`).pipe(
//     map(movie => ({
//       id: movie.id,
//       poster_path: movie.poster_path,
//       backdrop_path: movie.backdrop_path,
//       original_title: movie.original_title,
//       overview: movie.overview
//     }))
//   );
// }

// //get movie video
// getMovieVideo(movieId:number):Observable<string> {
//   return this.http.get<any>(`movie/${movieId}/videos?api_key=`)
//   .pipe(
//     map((result) => {
//       console.log(result, '#video result from service map operator');
//       const trailerVideo = result.results.find((video:{type:string, key: string}) => video.type === 'Trailer');
//       return trailerVideo ? trailerVideo.key : null;
//     })
//   );
// }

// //get movie cast
// getMovieCast(movieId: number):Observable<Cast[]> {
//   return this.http.get<CastObj>(`movie/${movieId}/credits?api_key=`)
//     .pipe(
//       map( result => result.cast.map( actor => ({
//         profile_path: actor.profile_path,
//         original_name: actor.original_name,
//         character: actor.character
//       })))
//     )
// }
