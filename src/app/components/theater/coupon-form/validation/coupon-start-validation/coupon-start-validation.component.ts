/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-coupon-start-validation',
    imports: [],
    templateUrl: './coupon-start-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-start-validation.component.css']
})
export class CouponStartValidationComponent {
  @Input() startControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
