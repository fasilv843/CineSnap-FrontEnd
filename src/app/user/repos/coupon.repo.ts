import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type ICouponRes } from 'src/app/core/models/coupon.model'

@Injectable({ providedIn: 'root' })
export class UserCouponRepo {
  private readonly http = inject(HttpClient)

  getApplicableCouopns (userId: string, ticketId: string): Observable<IApiRes<ICouponRes[] | null>> {
    return this.http.get<IApiRes<ICouponRes[] | null>>(`user/coupons/applicable-coupons/${userId}?ticketId=${ticketId}`)
  }
}
