import { type genreType, type IFilterEvent, type langType } from '../../core/models/filter.model'

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

/** user/movies?page=&g1=&l1=&availability= — the catalogue listing every section reads */
export function filteredMoviesUrl (filters: IFilterEvent, page: number): string {
  let url = `user/movies?page=${page}`
  const genreStr = getGenreQuery(filters.filterGenres)
  const languageStr = getLanguageQuery(filters.filterLanguages)

  if (genreStr !== '') url += '&' + genreStr
  if (languageStr !== '') url += '&' + languageStr
  url += `&availability=${filters.availability}`
  return url
}
