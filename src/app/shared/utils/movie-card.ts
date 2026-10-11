import { type ICSMovieRes } from '../models/movie'
import { type genreType, type langType } from '../models/filter'
import { getGenre, getLanguage } from './movie'

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/'

/** What the user-facing movie lists need from a CineSnap movie, ready to render. */
export interface MovieCard {
  id: string
  title: string
  year: number
  backdrop: string | null
  poster: string
  meta: string
  genres: genreType[]
  language: langType
}

export function toMovieCard (movie: ICSMovieRes): MovieCard {
  const genres = movie.genre_ids.slice(0, 2).map(id => getGenre(id)).join(', ')
  const runtime = `${movie.duration.hours}h ${movie.duration.minutes}m`
  return {
    id: movie._id,
    title: movie.title,
    year: new Date(movie.release_date).getFullYear(),
    backdrop: movie.backdrop_path !== undefined && movie.backdrop_path !== '' ? `${TMDB_IMAGE}w1280${movie.backdrop_path}` : null,
    poster: `${TMDB_IMAGE}w342${movie.poster_path}`,
    meta: [getLanguage(movie.language), genres, runtime].filter(Boolean).join(' · '),
    genres: movie.genre_ids,
    language: movie.language
  }
}

export interface FilterOption<T> { value: T, label: string }

export function toFilterOptions (genres: genreType[], languages: langType[]): { genres: Array<FilterOption<genreType>>, languages: Array<FilterOption<langType>> } {
  return {
    genres: genres.map(value => ({ value, label: getGenre(value) })).sort((a, b) => a.label.localeCompare(b.label)),
    languages: languages.map(value => ({ value, label: getLanguage(value) })).sort((a, b) => a.label.localeCompare(b.label))
  }
}
