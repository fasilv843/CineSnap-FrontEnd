import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-city-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-validation.component.html',
  styleUrls: ['./city-validation.component.css']
})
export class CityValidationComponent {
  @Input() cityControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
  @Input() addressUpdateMode: boolean = false
}
