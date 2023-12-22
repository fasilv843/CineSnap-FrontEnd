import { Component, Inject, type OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { FormBuilder, type FormGroup, ReactiveFormsModule } from '@angular/forms'
import { validateByTrimming } from 'src/app/helpers/validations'
import { walletAmountValidators } from 'src/app/shared/valiators'
import { WalletAmountValidationComponent } from '../../validation/wallet-amount-validation/wallet-amount-validation.component'

@Component({
  selector: 'app-add-to-wallet-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    ReactiveFormsModule,
    WalletAmountValidationComponent
  ],
  templateUrl: './add-to-wallet-modal.component.html',
  styleUrls: ['./add-to-wallet-modal.component.css']
})
export class AddToWalletModalComponent implements OnInit {
  isSubmitted = false
  amountSetByCode = false
  form!: FormGroup

  constructor (
    @Inject(NgbActiveModal) public activeModal: NgbActiveModal,
    @Inject(FormBuilder) private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit (): void {
    this.form = this.formBuilder.group({
      amount: ['', [validateByTrimming(walletAmountValidators)]]
    })
  }

  onSubmit (): void {
    this.isSubmitted = true
    if (this.form.valid && !this.amountSetByCode) {
      const amountData = this.form.value
      console.log(amountData, 'amountData from onSubmit()')
      this.activeModal.close(amountData)
    } else {
      console.log('wallet form erros', this.form.controls['amount'].errors)
    }
  }

  fillAmount (amount: number): void {
    this.amountSetByCode = true
    this.form.get('amount')?.setValue(String(amount))
    // this.amountSetByCode = false
  }

  onClickAdd (): void {
    this.amountSetByCode = false
  }

  onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
