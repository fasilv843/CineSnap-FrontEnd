
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-def-price-validation',
    imports: [],
    templateUrl: './def-price-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./def-price-validation.component.css']
})
export class DefPriceValidationComponent {
  @Input() priceControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
