/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'

import { AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-min-ticket-validation',
    imports: [],
    templateUrl: './min-ticket-validation.component.html',
    styleUrls: ['./min-ticket-validation.component.css']
})
export class MinTicketValidationComponent {
  @Input() minTicketControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
