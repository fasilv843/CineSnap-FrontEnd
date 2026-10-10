/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-count-validation',
    imports: [],
    templateUrl: './coupon-count-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-count-validation.component.css']
})
export class CouponCountValidationComponent {
  readonly couponCountControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
