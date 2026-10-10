import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ActiveModal } from 'src/app/services/modal.service'
import { validateByTrimming } from 'src/app/helpers/validations'
import { walletAmountValidators } from 'src/app/shared/valiators'
import { MAX_WALLET_ADD, MIN_WALLET_ADD } from 'src/app/shared/constants'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

/** Asks for an amount to add to a wallet. Closes with `{ amount }` (the typed string); payment happens in the caller. */
@Component({
  selector: 'app-add-to-wallet-modal',
  imports: [ReactiveFormsModule, ButtonDirective, FieldErrorComponent],
  templateUrl: './add-to-wallet-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class AddToWalletModalComponent {
  private readonly activeModal = inject(ActiveModal)

  protected readonly amount = new FormControl('', { nonNullable: true, validators: [validateByTrimming(walletAmountValidators)] })
  protected readonly form = new FormGroup({ amount: this.amount })
  protected readonly submitted = signal(false)
  protected readonly presets = [100, 500, 1000]
  protected readonly errorMessages = {
    required: 'Enter an amount',
    pattern: 'Use whole rupees, numbers only',
    min: `The minimum is ₹${MIN_WALLET_ADD}`,
    max: `The maximum is ₹${MAX_WALLET_ADD}`
  }

  protected usePreset (value: number): void {
    this.amount.setValue(String(value))
  }

  protected onSubmit (): void {
    this.submitted.set(true)
    if (this.amount.valid) this.activeModal.close({ amount: this.amount.value })
  }

  protected onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
