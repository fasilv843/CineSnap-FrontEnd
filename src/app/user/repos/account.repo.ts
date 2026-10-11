import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes, type IWalletHistoryAndCount } from 'src/app/core/models/api.model'
import { type IApiUserRes, type IUserUpdate } from 'src/app/core/models/user.model'

/** The signed-in user's own profile and wallet */
@Injectable({ providedIn: 'root' })
export class UserAccountRepo {
  private readonly http = inject(HttpClient)

  getUserDetails (userId: string): Observable<IApiUserRes> {
    return this.http.get<IApiUserRes>(`user/get/${userId}`)
  }

  updateUserDetails (userId: string, userData: IUserUpdate): Observable<IApiUserRes> {
    return this.http.put<IApiUserRes>(`user/update/${userId}`, userData)
  }

  updateUserProfile (userId: string, formData: FormData): Observable<IApiUserRes> {
    return this.http.patch<IApiUserRes>(`user/update/profileimage/${userId}`, formData)
  }

  deleteUserProfile (userId: string): Observable<IApiUserRes> {
    return this.http.patch<IApiUserRes>(`user/remove/profileimage/${userId}`, {})
  }

  updateUserWallet (userId: string, amount: number): Observable<IApiUserRes> {
    return this.http.patch<IApiUserRes>(`user/wallet/add/${userId}`, { amount })
  }

  getUserWalletHistory (userId: string, page: number, limit: number): Observable<IApiRes<IWalletHistoryAndCount | null>> {
    return this.http.get<IApiRes<IWalletHistoryAndCount | null>>(`user/wallet-history/${userId}?page=${page}&limit=${limit}`)
  }
}
