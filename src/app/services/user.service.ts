/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiUserRes, IApiUsersRes } from '../models/users';

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
}
