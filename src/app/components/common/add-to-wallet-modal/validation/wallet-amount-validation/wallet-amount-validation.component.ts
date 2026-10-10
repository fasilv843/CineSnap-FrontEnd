import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-wallet-amount-validation',
    imports: [],
    templateUrl: './wallet-amount-validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./wallet-amount-validation.component.css']
})
export class WalletAmountValidationComponent {
  @Input() amountControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
