/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-start-validation',
    imports: [],
    templateUrl: './coupon-start-validation.component.html',
    styleUrls: ['./coupon-start-validation.component.css']
})
export class CouponStartValidationComponent {
  @Input() startControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
