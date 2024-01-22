/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-min-ticket-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './min-ticket-validation.component.html',
  styleUrls: ['./min-ticket-validation.component.css']
})
export class MinTicketValidationComponent {
  @Input() minTicketControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
