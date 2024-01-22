import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-screen-select-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './screen-select-validation.component.html',
  styleUrls: ['./screen-select-validation.component.css']
})
export class ScreenSelectValidationComponent {
  @Input() screenControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
