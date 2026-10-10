/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-count-validation',
    imports: [],
    templateUrl: './coupon-count-validation.component.html',
    styleUrls: ['./coupon-count-validation.component.css']
})
export class CouponCountValidationComponent {
  @Input() couponCountControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
