/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-discount-type-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discount-type-validation.component.html',
  styleUrls: ['./discount-type-validation.component.css']
})
export class DiscountTypeValidationComponent {
  @Input() discountTypeControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
