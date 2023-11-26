import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-repeat-pass-validation',
  templateUrl: './repeat-pass-validation.component.html',
  styleUrls: ['./repeat-pass-validation.component.css']
})
export class RepeatPassValidationComponent {
  @Input() repeatPassControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
