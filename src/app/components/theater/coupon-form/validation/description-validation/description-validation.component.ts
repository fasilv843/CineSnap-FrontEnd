/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-description-validation',
    imports: [],
    templateUrl: './description-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./description-validation.component.css']
})
export class DescriptionValidationComponent {
  @Input() descriptionControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
