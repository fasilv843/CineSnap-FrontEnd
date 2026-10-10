
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-repeat-pass-validation',
    imports: [],
    templateUrl: './repeat-pass-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./repeat-pass-validation.component.css']
})
export class RepeatPassValidationComponent {
  @Input() repeatPassControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
