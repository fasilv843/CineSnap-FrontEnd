import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormField, form } from '@angular/forms/signals'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { textRules } from 'src/app/shared/utils/form-rules'
import { MAX_WALLET_ADD, MIN_WALLET_ADD, numRegex } from 'src/app/core/constants/constants'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

/** Asks for an amount to add to a wallet. Closes with `{ amount }` (the typed string); payment happens in the caller. */
@Component({
  selector: 'app-add-to-wallet-modal',
  imports: [FormField, ButtonDirective, FieldErrorComponent],
  templateUrl: './add-to-wallet-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToWalletModalComponent {
  private readonly activeModal = inject(ActiveModal)

  private readonly amount = signal('')
  protected readonly amountForm = form(this.amount, p => {
    textRules(p, {
      required: 'Enter an amount',
      pattern: [numRegex, 'Use whole rupees, numbers only'],
      min: [MIN_WALLET_ADD, `The minimum is ₹${MIN_WALLET_ADD}`],
      max: [MAX_WALLET_ADD, `The maximum is ₹${MAX_WALLET_ADD}`]
    })
  })
  protected readonly submitted = signal(false)
  protected readonly presets = [100, 500, 1000]

  protected usePreset (value: number): void {
    this.amount.set(String(value))
  }

  protected onSubmit (): void {
    this.submitted.set(true)
    if (this.amountForm().valid()) this.activeModal.close({ amount: this.amount() })
  }

  protected onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
