import { Component, Inject } from '@angular/core'

import { type ICouponRes } from 'src/app/models/coupon'
import { ActiveModal } from 'src/app/services/modal.service'

@Component({
    selector: 'app-coupon-modal',
    imports: [],
    templateUrl: './coupon-modal.component.html',
    styleUrls: ['./coupon-modal.component.css']
})
export class CouponModalComponent {
  modalTitle: string = 'Coupons'
  coupons: ICouponRes[] = []
  appliedCouponId = ''

  constructor (
    @Inject(ActiveModal) public readonly activeModal: ActiveModal
  ) {}

  onApply (coupon: ICouponRes): void {
    this.activeModal.close(coupon)
  }

  onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
