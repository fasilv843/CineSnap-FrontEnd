/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-discount-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discount-validation.component.html',
  styleUrls: ['./discount-validation.component.css']
})
export class DiscountValidationComponent {
  @Input() discountControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
