
import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-screen-name-validation',
    imports: [],
    templateUrl: './screen-name-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./screen-name-validation.component.css']
})
export class ScreenNameValidationComponent {
  readonly nameControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input<boolean>(false);
}
