import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-def-price-validation',
  templateUrl: './def-price-validation.component.html',
  styleUrls: ['./def-price-validation.component.css']
})
export class DefPriceValidationComponent {
  @Input() defPriceControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
