
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-col-validation',
    imports: [],
    templateUrl: './col-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./col-validation.component.css']
})
export class ColValidationComponent {
  @Input() colControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
