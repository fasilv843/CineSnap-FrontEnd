
import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-screen-select-validation',
    imports: [],
    templateUrl: './screen-select-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./screen-select-validation.component.css']
})
export class ScreenSelectValidationComponent {
  readonly screenControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input<boolean>(false);
}
