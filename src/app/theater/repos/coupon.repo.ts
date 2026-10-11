import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type ICouponReqs, type ICouponRes } from 'src/app/core/models/coupon.model'

@Injectable({ providedIn: 'root' })
export class TheaterCouponRepo {
  private readonly http = inject(HttpClient)

  saveCoupon (coupon: ICouponReqs): Observable<IApiRes<ICouponRes | null>> {
    return this.http.post<IApiRes<ICouponRes | null>>('theater/coupon/save', { coupon })
  }

  findCouponsOnTheater (theaterId: string): Observable<IApiRes<ICouponRes[] | null>> {
    return this.http.get<IApiRes<ICouponRes[] | null>>(`theater/coupons/theater-coupons/${theaterId}`)
  }

  cancelCoupon (couponId: string): Observable<IApiRes<ICouponRes | null>> {
    return this.http.patch<IApiRes<ICouponRes | null>>(`theater/coupons/cancel/${couponId}`, {})
  }
}
