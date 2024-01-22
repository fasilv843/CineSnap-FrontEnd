import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-dob-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dob-validation.component.html',
  styleUrls: ['./dob-validation.component.css']
})
export class DobValidationComponent {
  @Input() dobControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
