
import { Component, Input } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-screen-name-validation',
    imports: [],
    templateUrl: './screen-name-validation.component.html',
    styleUrls: ['./screen-name-validation.component.css']
})
export class ScreenNameValidationComponent {
  @Input() nameControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
