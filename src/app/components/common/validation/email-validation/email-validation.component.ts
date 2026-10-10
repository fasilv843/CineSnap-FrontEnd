
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-email-validation',
    imports: [],
    templateUrl: './email-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./email-validation.component.css']
})
export class EmailValidationComponent {
  @Input() emailControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
