
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-password-validation',
    imports: [],
    templateUrl: './password-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./password-validation.component.css']
})
export class PasswordValidationComponent {
  @Input() passwordControl: AbstractControl | null = null
  @Input() isSubmitted = false
}
