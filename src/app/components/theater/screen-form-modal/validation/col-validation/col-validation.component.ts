
import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-col-validation',
    imports: [],
    templateUrl: './col-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./col-validation.component.css']
})
export class ColValidationComponent {
  readonly colControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input<boolean>(false);
}
