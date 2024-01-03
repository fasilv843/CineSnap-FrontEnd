/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiUserRes, IApiUsersRes, IUserUpdate, IUsersAndCount } from '../models/users';
import { IApiRes, IWalletHistory } from '../models/common';
import { IUsersListForChats } from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (
    private readonly http: HttpClient
  ) { }

  getAllUsers (page: number, limit: number, searchQuery: string): Observable<IApiRes<IUsersAndCount | null>> {
    return this.http.get<IApiRes<IUsersAndCount | null>>(`admin/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`)
  }

  blockUser (userId: string): Observable<IApiUserRes> {
    return this.http.patch<IApiUserRes>(`admin/users/block/${userId}`, {})
  }

  getBlockedUsers (): Observable<IApiUsersRes> {
    return this.http.get<IApiUsersRes>('admin/users?blocked=true')
  }

  getActiveUsers (): Observable<IApiUsersRes> {
    return this.http.get<IApiUsersRes>('admin/users?blocked=false')
  }

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

  getUsersChattedWith (theaterId: string): Observable<IApiRes<IUsersListForChats[] | null>> {
    return this.http.get<IApiRes<IUsersListForChats[] | null>>(`theater/chat/users/${theaterId}`)
  }

  updateUserWallet (userId: string, amount: number): Observable<IApiUserRes> {
    return this.http.patch<IApiUserRes>(`user/wallet/add/${userId}`, { amount })
  }

  getUserWalletHistory (userId: string): Observable<IApiRes<IWalletHistory[] | null>> {
    return this.http.get<IApiRes<IWalletHistory[] | null>>(`user/wallet-history/${userId}`)
  }
}
