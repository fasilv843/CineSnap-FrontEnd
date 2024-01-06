import { Component, Inject, type OnInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CouponFormComponent } from '../coupon-form/coupon-form.component'
import { type ICouponRes, type ICouponReqs } from 'src/app/models/coupon'
import { CouponService } from 'src/app/services/coupon.service'
import { Store, select } from '@ngrx/store'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  selector: 'app-thr-coupon',
  templateUrl: './thr-coupon.component.html',
  styleUrls: ['./thr-coupon.component.css']
})
export class ThrCouponComponent implements OnInit {
  theaterData$ = this.store.pipe(select(selectTheaterDetails))
  theaterId = ''
  coupons: ICouponRes[] = []

  constructor (
    @Inject(NgbModal) private readonly ngbModal: NgbModal,
    @Inject(CouponService) private readonly couponService: CouponService,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.theaterData$.subscribe(theater => {
      if (theater !== null) this.theaterId = theater._id
    })

    this.couponService.findCouponsOnTheater(this.theaterId).subscribe({
      next: (res) => {
        if (res.data === null) return
        console.log(res, 'res from save coupon')
        this.coupons = [...this.coupons, ...res.data]
      }
    })
  }

  addNewCoupon (): void {
    console.log('adding new coupon')
    const modalRef = this.ngbModal.open(CouponFormComponent, { backdrop: 'static', centered: true })

    modalRef.componentInstance.modalTitle = 'Add Coupon'
    modalRef.componentInstance.submitBtn = 'Add'

    void modalRef.result.then(
      (result: ICouponReqs) => {
        result.theaterId = this.theaterId
        console.log('submitted form data', result)
        this.couponService.saveCoupon(result).subscribe({
          next: (res) => {
            if (res.data === null) return
            console.log(res, 'res from save coupon')
            this.coupons.push(res.data)
          }
        })
      },
      (reason: string) => {
        // Handle dismissal or any other reason
        console.log('Modal dismissed with reason:', reason)
      }
    )
  }

  onCancel (couponId: string): void {
    this.couponService.cancelCoupon(couponId).subscribe({
      next: (res) => {
        if (res.data !== null) {
          console.log(res.data, 'cancelled coupon')
          const couponIdx = this.coupons.findIndex(coupon => coupon._id === couponId)
          if (couponIdx !== -1) {
            this.coupons = [
              ...this.coupons.slice(0, couponIdx),
              { ...this.coupons[couponIdx], isCancelled: !this.coupons[couponIdx].isCancelled },
              ...this.coupons.slice(couponIdx + 1)
            ]
          }
        }
      }
    })
  }
}
