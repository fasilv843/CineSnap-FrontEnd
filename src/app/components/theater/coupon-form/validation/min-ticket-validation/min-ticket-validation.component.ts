/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-min-ticket-validation',
    imports: [],
    templateUrl: './min-ticket-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./min-ticket-validation.component.css']
})
export class MinTicketValidationComponent {
  readonly minTicketControl = input<AbstractControl | null>(null);
  readonly isSubmitted = input(false);
}
