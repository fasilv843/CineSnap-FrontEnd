import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-country-validation',
  templateUrl: './country-validation.component.html',
  styleUrls: ['./country-validation.component.css']
})
export class CountryValidationComponent {
  @Input() countryControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
