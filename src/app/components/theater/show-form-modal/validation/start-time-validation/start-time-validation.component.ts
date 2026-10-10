
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-start-time-validation',
    imports: [],
    templateUrl: './start-time-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./start-time-validation.component.css']
})
export class StartTimeValidationComponent {
  @Input() startTimeControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
