import { Component, ChangeDetectionStrategy, inject } from '@angular/core'

import { type ICouponRes } from 'src/app/models/coupon'
import { ActiveModal } from 'src/app/services/modal.service'

@Component({
    selector: 'app-coupon-modal',
    imports: [],
    templateUrl: './coupon-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./coupon-modal.component.css']
})
export class CouponModalComponent {
  readonly activeModal = inject(ActiveModal)

  modalTitle: string = 'Coupons'
  coupons: ICouponRes[] = []
  appliedCouponId = ''

  onApply (coupon: ICouponRes): void {
    this.activeModal.close(coupon)
  }

  onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
