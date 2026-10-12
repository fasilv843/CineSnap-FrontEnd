import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { FormField, form, maxLength, validate } from '@angular/forms/signals'
import { dateToString } from 'src/app/shared/utils/date'
import { checkText, textRules } from 'src/app/shared/utils/form-rules'
import { type ICouponReqs } from 'src/app/core/models/coupon.model'
import { ActiveModal } from 'src/app/shared/ui/modal.service'
import { numRegex } from 'src/app/core/constants/constants'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { FieldErrorComponent } from 'src/app/shared/ui/field-error.component'

type DiscountType = ICouponReqs['discountType']

/** Creates a coupon; closes with the coupon fields (the page adds the theater id). */
@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrl: './coupon-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, ButtonDirective, FieldErrorComponent]
})
export class CouponFormComponent {
  protected readonly modal = inject(ActiveModal)
  protected readonly today = dateToString(new Date())

  private readonly model = signal({
    code: '',
    description: '',
    discountType: 'Percentage' as DiscountType,
    discount: '',
    maxDiscountAmt: '',
    startDate: this.today,
    endDate: '',
    minTicketCount: '',
    couponCount: ''
  })

  protected readonly form = form(this.model, p => {
    // Codes are capitals; lowercase typing is accepted and shown uppercase
    validate(p.code, ({ value }) => checkText(value().trim().toUpperCase(), {
      required: 'Enter a code',
      pattern: [/^[A-Z0-9]{3,15}$/, '3 to 15 capital letters or numbers']
    }))
    maxLength(p.code, 15)
    textRules(p.description, {
      required: 'Describe the offer',
      minLength: [10, 'Use at least 10 characters'],
      maxLength: [100, 'Use at most 100 characters']
    })
    maxLength(p.description, 100)
    textRules(p.discount, { required: 'Enter the discount', pattern: [numRegex, 'Use a whole number'], min: [1, 'At least 1'], max: [1000, 'At most 1000'] })
    // A percentage coupon needs a cap (the backend requires one); a fixed one has none
    validate(p.maxDiscountAmt, ({ value, valueOf }) => valueOf(p.discountType) !== 'Percentage'
      ? undefined
      : checkText(value().trim(), { required: 'Percentage coupons need a cap', pattern: [numRegex, 'Use whole rupees'], max: [5000, 'At most ₹5000'] }))
    textRules(p.startDate, { required: 'Choose a start date' })
    validate(p.endDate, ({ value, valueOf }) => {
      if (value() === '') return { kind: 'required', message: 'Choose an end date' }
      const start = valueOf(p.startDate)
      return start !== '' && value() < start ? { kind: 'beforeStart', message: 'Ends before it starts' } : undefined
    })
    textRules(p.minTicketCount, { pattern: [numRegex, 'Use a whole number'], max: [10, 'At most 10'] })
    textRules(p.couponCount, { pattern: [numRegex, 'Use a whole number'] })
  })

  protected readonly discountType = computed(() => this.model().discountType)
  protected readonly startDate = computed(() => this.model().startDate)
  protected readonly submitted = signal(false)

  protected submit (): void {
    this.submitted.set(true)
    if (this.form().invalid()) return
    const v = this.model()
    const coupon: Omit<ICouponReqs, 'theaterId'> = {
      code: v.code.trim().toUpperCase(),
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
