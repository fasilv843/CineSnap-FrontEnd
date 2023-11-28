import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-city-validation',
  templateUrl: './city-validation.component.html',
  styleUrls: ['./city-validation.component.css']
})
export class CityValidationComponent {
  @Input() cityControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
