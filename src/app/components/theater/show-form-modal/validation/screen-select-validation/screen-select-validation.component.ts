
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-screen-select-validation',
    imports: [],
    templateUrl: './screen-select-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./screen-select-validation.component.css']
})
export class ScreenSelectValidationComponent {
  @Input() screenControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
