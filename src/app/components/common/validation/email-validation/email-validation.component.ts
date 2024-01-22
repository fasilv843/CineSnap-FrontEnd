import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-email-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-validation.component.html',
  styleUrls: ['./email-validation.component.css']
})
export class EmailValidationComponent {
  @Input() emailControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
