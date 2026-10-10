
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-movie-select-validation',
    imports: [],
    templateUrl: './movie-select-validation.component.html',
    styleUrls: ['./movie-select-validation.component.css']
})
export class MovieSelectValidationComponent {
  @Input() movieId = ''
  @Input() isSubmitted: boolean = false
}
