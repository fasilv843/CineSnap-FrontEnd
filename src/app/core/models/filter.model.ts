import { type GENRE_NAMES } from '../constants/genres'
import { type LanguageAbbreviation } from '../constants/languages'

export type genreType = keyof typeof GENRE_NAMES
export type langType = keyof typeof LanguageAbbreviation
export type valueType = genreType | langType | 'Deleted' | 'Available'

export interface IFilterEvent {
  filterGenres: genreType[]
  filterLanguages: langType[]
  availability: 'Deleted' | 'Available' | 'All'
}

export interface IApiFilters {
  status: number
  message: string
  genres: genreType[]
  languages: langType[]
}
