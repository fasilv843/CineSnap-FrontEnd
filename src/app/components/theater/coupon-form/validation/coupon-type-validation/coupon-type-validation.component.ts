/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-type-validation',
    imports: [],
    templateUrl: './coupon-type-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-type-validation.component.css']
})
export class CouponTypeValidationComponent {
  @Input() couponTypeControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
