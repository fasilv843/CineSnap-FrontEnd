/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-code-validation',
    imports: [],
    templateUrl: './code-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./code-validation.component.css']
})
export class CodeValidationComponent {
  readonly codeControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
