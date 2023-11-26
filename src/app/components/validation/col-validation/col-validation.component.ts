import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-col-validation',
  templateUrl: './col-validation.component.html',
  styleUrls: ['./col-validation.component.css']
})
export class ColValidationComponent {
  @Input() colControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
