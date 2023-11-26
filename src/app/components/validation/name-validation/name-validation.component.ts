import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-name-validation',
  templateUrl: './name-validation.component.html',
  styleUrls: ['./name-validation.component.css']
})
export class NameValidationComponent {
  @Input() nameControl: AbstractControl | null = null // Assuming it's a FormControl
  @Input() isSubmitted: boolean = false
}
