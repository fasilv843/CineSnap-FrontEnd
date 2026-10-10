/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-discount-type-validation',
    imports: [],
    templateUrl: './discount-type-validation.component.html',
    styleUrls: ['./discount-type-validation.component.css']
})
export class DiscountTypeValidationComponent {
  @Input() discountTypeControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
