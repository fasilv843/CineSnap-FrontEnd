/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-discount-validation',
    imports: [],
    templateUrl: './discount-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./discount-validation.component.css']
})
export class DiscountValidationComponent {
  readonly discountControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
