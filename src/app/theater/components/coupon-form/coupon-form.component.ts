import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { type AbstractControl, FormControl, FormGroup, ReactiveFormsModule, type ValidationErrors, Validators } from '@angular/forms'
import { dateToString } from 'src/app/helpers/date'
import { validateByTrimming } from 'src/app/helpers/validations'
import { type ICouponReqs } from 'src/app/models/coupon'
import { ActiveModal } from 'src/app/services/modal.service'
import {
  codeValidators, couponCountValidators, descriptionValidators, discountValidators, endDateValidators,
  maxDiscountAmtValidators, minTicketCountValidators, startDateValidators
} from 'src/app/shared/valiators'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

type DiscountType = ICouponReqs['discountType']

/** End date on or after the start date; a percentage coupon needs a cap (the backend requires one) */
function couponRules (group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')
  const end = group.get('endDate')
  const type = group.get('discountType')?.value as DiscountType
  const cap = group.get('maxDiscountAmt')

  if (start?.value !== '' && end?.value !== '' && end !== null && end.value < start?.value) {
    end.setErrors({ ...end.errors, beforeStart: true })
  } else if (end?.hasError('beforeStart') === true) {
    const { beforeStart, ...rest } = end.errors ?? {}
    end.setErrors(Object.keys(rest).length > 0 ? rest : null)
  }

  if (type === 'Percentage' && (cap?.value ?? '') === '') {
    cap?.setErrors({ ...cap.errors, required: true })
  } else if (cap?.hasError('required') === true && type !== 'Percentage') {
    const { required, ...rest } = cap.errors ?? {}
    cap.setErrors(Object.keys(rest).length > 0 ? rest : null)
  }
  return null
}

/** Creates a coupon; closes with the coupon fields (the page adds the theater id). */
@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrl: './coupon-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonDirective, FieldErrorComponent]
})
export class CouponFormComponent {
  protected readonly modal = inject(ActiveModal)
  protected readonly today = dateToString(new Date())

  protected readonly form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [validateByTrimming(codeValidators)] }),
    description: new FormControl('', { nonNullable: true, validators: [validateByTrimming(descriptionValidators)] }),
    discountType: new FormControl<DiscountType>('Percentage', { nonNullable: true, validators: [Validators.required] }),
    discount: new FormControl('', { nonNullable: true, validators: [validateByTrimming(discountValidators)] }),
    maxDiscountAmt: new FormControl('', { nonNullable: true, validators: [validateByTrimming(maxDiscountAmtValidators)] }),
    startDate: new FormControl(this.today, { nonNullable: true, validators: [validateByTrimming(startDateValidators)] }),
    endDate: new FormControl('', { nonNullable: true, validators: [validateByTrimming(endDateValidators)] }),
    minTicketCount: new FormControl('', { nonNullable: true, validators: [validateByTrimming(minTicketCountValidators)] }),
    couponCount: new FormControl('', { nonNullable: true, validators: [validateByTrimming(couponCountValidators)] })
  }, { validators: couponRules })

  protected readonly discountType = toSignal(this.form.controls.discountType.valueChanges, { initialValue: this.form.controls.discountType.value })
  protected readonly startDate = toSignal(this.form.controls.startDate.valueChanges, { initialValue: this.form.controls.startDate.value })
  protected readonly submitted = signal(false)

  protected readonly messages = {
    code: { required: 'Enter a code', pattern: '3 to 15 capital letters or numbers' },
    description: { required: 'Describe the offer', minlength: 'Use at least 10 characters', maxlength: 'Use at most 100 characters' },
    discount: { required: 'Enter the discount', min: 'At least 1', max: 'At most 1000', pattern: 'Use a whole number' },
    maxDiscountAmt: { required: 'Percentage coupons need a cap', max: 'At most ₹5000', pattern: 'Use whole rupees' },
    startDate: { required: 'Choose a start date' },
    endDate: { required: 'Choose an end date', beforeStart: 'Ends before it starts' },
    minTicketCount: { max: 'At most 10', pattern: 'Use a whole number' },
    couponCount: { pattern: 'Use a whole number' }
  }

  constructor () {
    // Codes are capitals; accept lowercase typing
    this.form.controls.code.valueChanges.subscribe(value => {
      if (value !== value.toUpperCase()) this.form.controls.code.setValue(value.toUpperCase(), { emitEvent: false })
    })
  }

  protected submit (): void {
    this.submitted.set(true)
    this.form.updateValueAndValidity()
    if (this.form.invalid) return
    const v = this.form.getRawValue()
    const coupon: Omit<ICouponReqs, 'theaterId'> = {
      code: v.code.trim(),
      description: v.description.trim(),
      couponType: 'Once',
      discountType: v.discountType,
      discount: Number(v.discount),
      maxDiscountAmt: v.discountType === 'Percentage' ? Number(v.maxDiscountAmt) : 0,
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
      minTicketCount: v.minTicketCount !== '' ? Number(v.minTicketCount) : 0
    }
    if (v.couponCount !== '') coupon.couponCount = Number(v.couponCount)
    this.modal.close(coupon)
  }
}
