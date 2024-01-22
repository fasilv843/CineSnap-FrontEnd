/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-coupon-type-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coupon-type-validation.component.html',
  styleUrls: ['./coupon-type-validation.component.css']
})
export class CouponTypeValidationComponent {
  @Input() couponTypeControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
