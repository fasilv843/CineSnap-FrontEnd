import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { type ICouponRes } from 'src/app/models/coupon'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-coupon-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './coupon-modal.component.html',
  styleUrls: ['./coupon-modal.component.css']
})
export class CouponModalComponent {
  modalTitle: string = 'Coupons'
  coupons: ICouponRes[] = []
  appliedCouponId = ''

  constructor (
    @Inject(NgbActiveModal) public readonly activeModal: NgbActiveModal
  ) {}

  onApply (coupon: ICouponRes): void {
    this.activeModal.close(coupon)
  }

  onCancel (): void {
    this.activeModal.dismiss('cancel')
  }
}
