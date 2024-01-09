/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ICouponReqs, ICouponRes } from '../models/coupon'
import { Observable } from 'rxjs'
import { IApiRes } from '../models/common'

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor (
    private readonly http: HttpClient
  ) { }

  saveCoupon (coupon: ICouponReqs): Observable<IApiRes<ICouponRes | null>> {
    return this.http.post<IApiRes<ICouponRes | null>>('theater/coupon/save', { coupon })
  }

  findCouponsOnTheater (theaterId: string): Observable<IApiRes<ICouponRes[] | null>> {
    return this.http.get<IApiRes<ICouponRes[] | null>>(`theater/coupons/theater-coupons/${theaterId}`)
  }

  cancelCoupon (couponId: string): Observable<IApiRes<ICouponRes | null>> {
    return this.http.patch<IApiRes<ICouponRes | null>>(`theater/coupons/cancel/${couponId}`, {})
  }

  getApplicableCouopns (userId: string, ticketId: string): Observable<IApiRes<ICouponRes[] | null>> {
    return this.http.get<IApiRes<ICouponRes[] | null>>(`user/coupons/applicable-coupons/${userId}?ticketId=${ticketId}`)
  }
}
