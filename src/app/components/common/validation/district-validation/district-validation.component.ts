import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-district-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './district-validation.component.html',
  styleUrls: ['./district-validation.component.css']
})
export class DistrictValidationComponent {
  @Input() districtControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
