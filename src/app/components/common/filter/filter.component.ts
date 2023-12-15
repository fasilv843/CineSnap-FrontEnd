import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Inject, Output, type OnInit, Input } from '@angular/core'
import { getGenre, getLanguage, isGenreType, isLangType } from 'src/app/helpers/movie'
import { type IFilterEvent, type langType, type genreType, type valueType } from 'src/app/models/filter'
import { MovieService } from 'src/app/services/movie.service'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() isAdmin: boolean = false
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
    if (type === 'Genres' && this.isGenreType(value)) {
      this.filterGenre.includes(value)
        ? this.filterGenre = this.filterGenre.filter(g => g !== value)
        : this.filterGenre.push(value)
    } else if (type === 'Languages' && this.isLangType(value)) {
      this.filterLanguages.includes(value)
        ? this.filterLanguages = this.filterLanguages.filter(lang => lang !== value)
        : this.filterLanguages.push(value)
    } else if (this.isAdmin && type === 'Availability' && (value === 'Deleted' || value === 'Available')) {
      this.avail.includes(value)
        ? this.avail = this.avail.filter(v => v !== value)
        : this.avail.push(value)
    }
    console.log(this.availability, 'availability')
    this.filterApplied.emit({
      filterGenres: this.filterGenre,
      filterLanguages: this.filterLanguages,
      availability: (this.avail.length === 0 || this.avail.length === 2) ? 'All' : this.avail[0]
    })
  }

  getGenre = getGenre
  getLanguage = getLanguage
  isGenreType = isGenreType
  isLangType = isLangType
}
