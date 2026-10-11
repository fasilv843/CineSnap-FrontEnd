import { type genreType, type langType } from '../models/filter'

export function getGenreQuery (genreFilters: genreType[]): string {
  let genreStr = ''
  for (let i = 1; i <= genreFilters.length; i++) {
    genreStr += `g${i}=${genreFilters[i - 1]}`
    if (i !== genreFilters.length) genreStr += '&'
  }
  return genreStr
}

export function getLanguageQuery (langFilters: langType[]): string {
  let langStr = ''
  for (let i = 1; i <= langFilters.length; i++) {
    langStr += `l${i}=${langFilters[i - 1]}`
    if (i !== langFilters.length) langStr += '&'
  }
  return langStr
}
