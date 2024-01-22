/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-description-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './description-validation.component.html',
  styleUrls: ['./description-validation.component.css']
})
export class DescriptionValidationComponent {
  @Input() descriptionControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
