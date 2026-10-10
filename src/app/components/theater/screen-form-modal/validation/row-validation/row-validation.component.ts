
import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-row-validation',
    imports: [],
    templateUrl: './row-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./row-validation.component.css']
})
export class RowValidationComponent {
  readonly rowControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input<boolean>(false);
}
