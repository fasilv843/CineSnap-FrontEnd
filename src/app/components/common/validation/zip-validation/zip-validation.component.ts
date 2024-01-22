import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-zip-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zip-validation.component.html',
  styleUrls: ['./zip-validation.component.css']
})
export class ZipValidationComponent {
  @Input() zipControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
