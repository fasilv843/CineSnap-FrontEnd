/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-code-validation',
    imports: [],
    templateUrl: './code-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./code-validation.component.css']
})
export class CodeValidationComponent {
  @Input() codeControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
