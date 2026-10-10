
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-mobile-validation',
    imports: [],
    templateUrl: './mobile-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./mobile-validation.component.css']
})
export class MobileValidationComponent {
  @Input() mobileControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
