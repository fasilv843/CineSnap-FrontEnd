
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'app-movie-select-validation',
    imports: [],
    templateUrl: './movie-select-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./movie-select-validation.component.css']
})
export class MovieSelectValidationComponent {
  @Input() movieId = ''
  @Input() isSubmitted: boolean = false
}
