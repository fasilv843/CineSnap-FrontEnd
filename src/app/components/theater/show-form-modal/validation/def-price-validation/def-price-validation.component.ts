import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-def-price-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './def-price-validation.component.html',
  styleUrls: ['./def-price-validation.component.css']
})
export class DefPriceValidationComponent {
  @Input() priceControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
