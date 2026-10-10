
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-city-validation',
    imports: [],
    templateUrl: './city-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./city-validation.component.css']
})
export class CityValidationComponent {
  @Input() cityControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
  @Input() addressUpdateMode: boolean = false
}
