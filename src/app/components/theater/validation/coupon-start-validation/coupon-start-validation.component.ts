/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-coupon-start-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coupon-start-validation.component.html',
  styleUrls: ['./coupon-start-validation.component.css']
})
export class CouponStartValidationComponent {
  @Input() startControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
