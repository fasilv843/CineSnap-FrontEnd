/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-code-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-validation.component.html',
  styleUrls: ['./code-validation.component.css']
})
export class CodeValidationComponent {
  @Input() codeControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
