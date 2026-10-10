
import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-start-time-validation',
    imports: [],
    templateUrl: './start-time-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./start-time-validation.component.css']
})
export class StartTimeValidationComponent {
  readonly startTimeControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input<boolean>(false);
}
