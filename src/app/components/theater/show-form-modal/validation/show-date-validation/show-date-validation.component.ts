
import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-show-date-validation',
    imports: [],
    templateUrl: './show-date-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./show-date-validation.component.css']
})
export class ShowDateValidationComponent {
  readonly showDateControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input<boolean>(false);
}
