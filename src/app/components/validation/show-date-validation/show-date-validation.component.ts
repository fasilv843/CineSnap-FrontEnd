import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-show-date-validation',
  templateUrl: './show-date-validation.component.html',
  styleUrls: ['./show-date-validation.component.css']
})
export class ShowDateValidationComponent {
  @Input() showDateControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
