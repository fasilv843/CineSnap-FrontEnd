import { type valueType, type genreType, type langType } from '../models/filter'
import { GENRE_NAMES } from '../shared/genreIds'
import { LanguageAbbreviation } from '../shared/langAbbreviation'

export function getGenre (genre: keyof typeof GENRE_NAMES): string {
  return GENRE_NAMES[genre]
}

export function getGenreId (genreName: string): number | undefined {
  const genreId = Object.keys(GENRE_NAMES).find((id) => GENRE_NAMES[parseInt(id)] === genreName)
  return (genreId !== undefined) ? parseInt(genreId) : undefined
}

export function getLanguage (lang: langType): string {
  return LanguageAbbreviation[lang]
}

export function getLanguageAbbr (language: string): langType | undefined {
  return Object.keys(LanguageAbbreviation).find((lang) => LanguageAbbreviation[lang as langType] === language) as langType | undefined
}

export function isGenreType (value: valueType): value is genreType {
  return Object.keys(GENRE_NAMES).includes(value.toString())
}

export function isLangType (value: valueType): value is langType {
  if (typeof value === 'number') return false
  return Object.keys(LanguageAbbreviation).includes(value)
}
