/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-end-validation',
    imports: [],
    templateUrl: './coupon-end-validation.component.html',
    styleUrls: ['./coupon-end-validation.component.css']
})
export class CouponEndValidationComponent {
  @Input() endControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
