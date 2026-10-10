
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-zip-validation',
    imports: [],
    templateUrl: './zip-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./zip-validation.component.css']
})
export class ZipValidationComponent {
  @Input() zipControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
