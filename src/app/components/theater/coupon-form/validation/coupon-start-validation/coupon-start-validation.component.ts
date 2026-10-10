/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-start-validation',
    imports: [],
    templateUrl: './coupon-start-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-start-validation.component.css']
})
export class CouponStartValidationComponent {
  readonly startControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
