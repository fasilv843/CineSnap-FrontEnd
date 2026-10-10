/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-max-discount-validation',
    imports: [],
    templateUrl: './max-discount-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./max-discount-validation.component.css']
})
export class MaxDiscountValidationComponent {
  readonly maxDiscountControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
