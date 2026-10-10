/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-description-validation',
    imports: [],
    templateUrl: './description-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./description-validation.component.css']
})
export class DescriptionValidationComponent {
  readonly descriptionControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
