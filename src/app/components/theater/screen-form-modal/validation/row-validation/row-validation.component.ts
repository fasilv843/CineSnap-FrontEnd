import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-row-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './row-validation.component.html',
  styleUrls: ['./row-validation.component.css']
})
export class RowValidationComponent {
  @Input() rowControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
