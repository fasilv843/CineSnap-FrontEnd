import { Component, EventEmitter, Inject, Output, type OnInit } from '@angular/core'
import { type IFilterEvent, type langType, type genreType, type valueType } from 'src/app/models/filter'
import { MovieService } from 'src/app/services/movie.service'
import { GENRE_NAMES } from 'src/app/shared/genreIds'
import { LanguageAbbreviation } from 'src/app/shared/langAbbreviation'

// export function debounce (callback: () => void, delay: number): void {
//   // eslint-disable-next-line prefer-const
//   let debounceTimeout: any

//   clearTimeout(debounceTimeout)
//   debounceTimeout = setTimeout(callback, delay)
// }

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<IFilterEvent>()
  languages: langType[] = []
  genres: genreType[] = []

  filterGenre: genreType[] = []
  filterLanguages: langType[] = []
  availability: 'Deleted' | 'Available' | 'All' = 'All'
  avail: Array<'Deleted' | 'Available' | 'All'> = []

  constructor (
    @Inject(MovieService) private readonly movieService: MovieService
  ) {}

  ngOnInit (): void {
    this.movieService.fetchFilterDatas().subscribe({
      next: (res) => {
        console.log(res, 'res from filter component')
        this.languages = res.languages
        this.genres = res.genres
      }
    })
  }

  applyFilter (value: valueType, type: 'Availability' | 'Genres' | 'Languages'): void {
    // console.log('applying filter ', value, type)
    // console.log(type === 'Genres', this.isGenreType(value), 'genre conditions')

    if (type === 'Genres' && this.isGenreType(value)) {
      // console.log('inside type genre')

      this.filterGenre.includes(value)
        ? this.filterGenre = this.filterGenre.filter(g => g !== value)
        : this.filterGenre.push(value)
      // console.log(this.filterGenre, 'updated filter genre')
    } else if (type === 'Languages' && this.isLangType(value)) {
      // console.log('inside type lang')

      this.filterLanguages.includes(value)
        ? this.filterLanguages = this.filterLanguages.filter(lang => lang !== value)
        : this.filterLanguages.push(value)
    } else if (type === 'Availability' && (value === 'Deleted' || value === 'Available')) {
      // console.log('inside type availability')

      this.avail.includes(value)
        ? this.avail = this.avail.filter(v => v !== value)
        : this.avail.push(value)
    }

    // console.log(this.filterGenre, 'filterGenre before emitting')

    this.filterApplied.emit({
      filterGenres: this.filterGenre,
      filterLanguages: this.filterLanguages,
      availability: (this.avail.length === 0 || this.avail.length === 2) ? 'All' : this.avail[0]
    })
  }

  getGenre (genre: keyof typeof GENRE_NAMES): string {
    return GENRE_NAMES[genre]
  }

  getLanguage (lang: keyof typeof LanguageAbbreviation): string {
    return LanguageAbbreviation[lang]
  }

  private isGenreType (value: valueType): value is genreType {
    // console.log(Object.keys(GENRE_NAMES).includes(value.toString()), value.toString(), 'from isGenreType in filter')
    return Object.keys(GENRE_NAMES).includes(value.toString())
  }

  private isLangType (value: valueType): value is langType {
    // console.log(Object.keys(LanguageAbbreviation), value, 'from isLangType')
    if (typeof value === 'number') return false
    return Object.keys(LanguageAbbreviation).includes(value)
  }
}
