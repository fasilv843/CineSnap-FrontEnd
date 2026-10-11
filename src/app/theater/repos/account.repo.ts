import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes, type IWalletHistoryAndCount } from 'src/app/core/models/api.model'
import { type IRevenueData } from 'src/app/core/models/chart.model'
import { type IApiTheaterRes, type ITheaterUpdate } from 'src/app/core/models/theater.model'

/** The signed-in theater's own profile, wallet and revenue */
@Injectable({ providedIn: 'root' })
export class TheaterAccountRepo {
  private readonly http = inject(HttpClient)

  updatetheaterDetails (theaterId: string, theater: ITheaterUpdate): Observable<IApiTheaterRes> {
    return this.http.put<IApiTheaterRes>(`theater/update/${theaterId}`, theater)
  }

  updateTheaterProfilePic (theaterId: string, formData: FormData): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`theater/update/profileimage/${theaterId}`, formData)
  }

  deleteTheaterProfilePic (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`theater/remove/profileimage/${theaterId}`, {})
  }

  updateTheaterWallet (theaterId: string, amount: number): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`theater/wallet/add/${theaterId}`, { amount })
  }

  getTheaterWalletHistory (theaterId: string, page: number, limit: number): Observable<IApiRes<IWalletHistoryAndCount | null>> {
    return this.http.get<IApiRes<IWalletHistoryAndCount | null>>(`theater/wallet-history/${theaterId}?page=${page}&limit=${limit}`)
  }

  getRevenueData (theaterId: string): Observable<IApiRes<IRevenueData | null>> {
    return this.http.get<IApiRes<IRevenueData | null>>(`theater/dashboard/revenue/${theaterId}`)
  }
}
