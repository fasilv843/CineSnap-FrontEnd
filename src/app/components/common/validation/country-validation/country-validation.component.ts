
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-country-validation',
    imports: [],
    templateUrl: './country-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./country-validation.component.css']
})
export class CountryValidationComponent {
  @Input() countryControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
