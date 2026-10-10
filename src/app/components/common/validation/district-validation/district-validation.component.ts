
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-district-validation',
    imports: [],
    templateUrl: './district-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./district-validation.component.css']
})
export class DistrictValidationComponent {
  @Input() districtControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
