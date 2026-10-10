/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-discount-validation',
    imports: [],
    templateUrl: './discount-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./discount-validation.component.css']
})
export class DiscountValidationComponent {
  @Input() discountControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
