import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-state-validation',
  templateUrl: './state-validation.component.html',
  styleUrls: ['./state-validation.component.css']
})
export class StateValidationComponent {
  @Input() stateControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
