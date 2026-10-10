
import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-def-price-validation',
    imports: [],
    templateUrl: './def-price-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./def-price-validation.component.css']
})
export class DefPriceValidationComponent {
  readonly priceControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input<boolean>(false);
}
