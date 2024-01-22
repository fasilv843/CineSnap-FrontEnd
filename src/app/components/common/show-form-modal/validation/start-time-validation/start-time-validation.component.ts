import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-start-time-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-time-validation.component.html',
  styleUrls: ['./start-time-validation.component.css']
})
export class StartTimeValidationComponent {
  @Input() startTimeControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
