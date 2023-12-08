import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-movie-select-validation',
  templateUrl: './movie-select-validation.component.html',
  styleUrls: ['./movie-select-validation.component.css']
})
export class MovieSelectValidationComponent {
  @Input() movieIdControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
