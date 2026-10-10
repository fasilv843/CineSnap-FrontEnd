/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-discount-validation',
    imports: [],
    templateUrl: './discount-validation.component.html',
    styleUrls: ['./discount-validation.component.css']
})
export class DiscountValidationComponent {
  @Input() discountControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
