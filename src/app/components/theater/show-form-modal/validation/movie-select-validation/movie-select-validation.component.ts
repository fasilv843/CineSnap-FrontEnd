
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

@Component({
    selector: 'app-movie-select-validation',
    imports: [],
    templateUrl: './movie-select-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./movie-select-validation.component.css']
})
export class MovieSelectValidationComponent {
  readonly movieId = input('');
  readonly isSubmitted = input<boolean>(false);
}
