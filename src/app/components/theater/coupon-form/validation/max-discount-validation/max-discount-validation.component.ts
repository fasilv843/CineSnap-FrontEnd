/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-max-discount-validation',
    imports: [],
    templateUrl: './max-discount-validation.component.html',
    styleUrls: ['./max-discount-validation.component.css']
})
export class MaxDiscountValidationComponent {
  @Input() maxDiscountControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
