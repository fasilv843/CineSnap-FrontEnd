
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-state-validation',
    imports: [],
    templateUrl: './state-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./state-validation.component.css']
})
export class StateValidationComponent {
  @Input() stateControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
