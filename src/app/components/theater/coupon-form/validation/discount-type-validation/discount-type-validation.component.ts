/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-discount-type-validation',
    imports: [],
    templateUrl: './discount-type-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./discount-type-validation.component.css']
})
export class DiscountTypeValidationComponent {
  readonly discountTypeControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
