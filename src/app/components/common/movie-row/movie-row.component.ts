import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Language, LanguageAbbreviation } from 'src/app/shared/langAbbreviation'
import { type Movie } from 'src/app/models/movie'

@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-row.component.html',
  styleUrls: ['./movie-row.component.css']
})
export class MovieRowComponent {
  @Input() tmdbIds: number[] = []
  @Input() language: string = Language.MALAYALAM
  @Input() movies: Movie[] = []
  @Input() searchResult = false

  getTitle (): string {
    if (this.searchResult) return 'Search Results'
    return LanguageAbbreviation[this.language as Language] + ' Movies'
  }

  @Output() exploreLangEvent = new EventEmitter<Language>()
  @Output() addMovieEvent = new EventEmitter<Movie>()

  exploreLanguage (): void {
    this.exploreLangEvent.emit(this.language as Language)
  }

  addMovie (movie: Movie): void {
    this.addMovieEvent.emit(movie)
  }

  isMovieAlreadyExist (tmdbId: number): boolean {
    return this.tmdbIds.includes(tmdbId)
  }
}
