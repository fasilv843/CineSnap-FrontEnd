
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-dob-validation',
    imports: [],
    templateUrl: './dob-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./dob-validation.component.css']
})
export class DobValidationComponent {
  @Input() dobControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
