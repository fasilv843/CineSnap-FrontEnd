/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-end-validation',
    imports: [],
    templateUrl: './coupon-end-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-end-validation.component.css']
})
export class CouponEndValidationComponent {
  readonly endControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
