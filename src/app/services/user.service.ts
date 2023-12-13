/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiUserRes, IApiUsersRes, IUserUpdate } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (
    private readonly http: HttpClient
  ) { }

  getAllUsers (): Observable<IApiUsersRes> {
    return this.http.get<IApiUsersRes>('admin/users')
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

  getUsersChattedWith (theaterId: string): Observable<IApiUsersRes> {
    return this.http.get<IApiUsersRes>(`theater/chat/users/${theaterId}`)
  }
}
