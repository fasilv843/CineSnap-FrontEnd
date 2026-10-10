
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-show-date-validation',
    imports: [],
    templateUrl: './show-date-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./show-date-validation.component.css']
})
export class ShowDateValidationComponent {
  @Input() showDateControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
