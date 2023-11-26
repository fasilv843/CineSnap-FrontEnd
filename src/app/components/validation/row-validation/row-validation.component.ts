import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-row-validation',
  templateUrl: './row-validation.component.html',
  styleUrls: ['./row-validation.component.css']
})
export class RowValidationComponent {
  @Input() rowControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
