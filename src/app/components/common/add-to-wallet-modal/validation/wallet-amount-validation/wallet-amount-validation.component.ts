import { Component, Input } from '@angular/core'

import { type AbstractControl } from '@angular/forms'

@Component({
    selector: 'app-wallet-amount-validation',
    imports: [],
    templateUrl: './wallet-amount-validation.component.html',
    styleUrls: ['./wallet-amount-validation.component.css']
})
export class WalletAmountValidationComponent {
  @Input() amountControl: AbstractControl | null = null
  @Input() isSubmitted: boolean = false
}
