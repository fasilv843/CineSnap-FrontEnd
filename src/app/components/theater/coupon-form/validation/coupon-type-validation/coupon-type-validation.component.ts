/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-type-validation',
    imports: [],
    templateUrl: './coupon-type-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-type-validation.component.css']
})
export class CouponTypeValidationComponent {
  readonly couponTypeControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
