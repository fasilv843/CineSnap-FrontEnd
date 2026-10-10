import { Component, ChangeDetectionStrategy, inject } from '@angular/core'

import { FormBuilder, type FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ActiveModal } from 'src/app/services/modal.service'
import { Store } from '@ngrx/store'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { validateByTrimming } from 'src/app/helpers/validations'
import { codeValidators, couponCountValidators, couponTypeValidators, descriptionValidators, discountTypeValidators, discountValidators, endDateValidators, maxDiscountAmtValidators, minTicketCountValidators, startDateValidators } from 'src/app/shared/valiators'
import { CodeValidationComponent } from './validation/code-validation/code-validation.component'
import { DescriptionValidationComponent } from './validation/description-validation/description-validation.component'
import { CouponStartValidationComponent } from './validation/coupon-start-validation/coupon-start-validation.component'
import { CouponEndValidationComponent } from './validation/coupon-end-validation/coupon-end-validation.component'
import { DiscountValidationComponent } from './validation/discount-validation/discount-validation.component'
import { MinTicketValidationComponent } from './validation/min-ticket-validation/min-ticket-validation.component'
import { CouponTypeValidationComponent } from './validation/coupon-type-validation/coupon-type-validation.component'
import { DiscountTypeValidationComponent } from './validation/discount-type-validation/discount-type-validation.component'
import { MaxDiscountValidationComponent } from './validation/max-discount-validation/max-discount-validation.component'
import { CouponCountValidationComponent } from './validation/coupon-count-validation/coupon-count-validation.component'

@Component({
    selector: 'app-coupon-form',
    imports: [
    ReactiveFormsModule,
    CodeValidationComponent,
    DescriptionValidationComponent,
    CouponStartValidationComponent,
    CouponEndValidationComponent,
    DiscountValidationComponent,
    MinTicketValidationComponent,
    CouponTypeValidationComponent,
    DiscountTypeValidationComponent,
    MaxDiscountValidationComponent,
    CouponCountValidationComponent
],
    templateUrl: './coupon-form.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent {
  private readonly formBuilder = inject(FormBuilder)
  activeModal = inject(ActiveModal)
  private readonly store = inject(Store)

  theaterDetails = this.store.selectSignal(selectTheaterDetails)
  couponForm!: FormGroup
  isSubmitted = false
  theaterId: string = ''

  modalTitle: string = ''
  submitBtn: string = ''

  ngOnInit (): void {
    this.couponForm = this.formBuilder.group({
      code: ['', [validateByTrimming(codeValidators)]],
      description: ['', [validateByTrimming(descriptionValidators)]],
      startDate: ['', [validateByTrimming(startDateValidators)]],
      endDate: ['', [validateByTrimming(endDateValidators)]],
      discount: ['', [validateByTrimming(discountValidators)]],
      minTicketCount: ['', [validateByTrimming(minTicketCountValidators)]],
      couponType: ['', [validateByTrimming(couponTypeValidators)]],
      discountType: ['', [validateByTrimming(discountTypeValidators)]],
      maxDiscountAmt: ['', [validateByTrimming(maxDiscountAmtValidators)]],
      couponCount: ['', [validateByTrimming(couponCountValidators)]]
    })

    const theater = this.theaterDetails()
    if (theater !== null) this.theaterId = theater._id
  }

  onSubmit (): void {
    this.isSubmitted = true
    if (this.couponForm.valid) {
      const couponData = this.couponForm.value
      console.log(couponData, 'screen form data from modal')
      if (couponData.minTicketCount === '') delete couponData.minTicketCount
      if (couponData.couponCount === '') delete couponData.couponCount
      this.activeModal.close(couponData)
    } else {
      console.log('couponForm is invalid', this.couponForm.controls)
    }
  }

  onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
