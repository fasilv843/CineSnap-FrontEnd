/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (
    private readonly http: HttpClient
  ) { }

  getAllUsers (): Observable<IUser[]> {
    return this.http.get<IUser[]>('admin/users')
  }

  blockUser (userId: string): Observable<IUser> {
    return this.http.patch<IUser>(`admin/users/block/${userId}`, {})
  }

  getBlockedUsers (): Observable<IUser[]> {
    return this.http.get<IUser[]>('admin/users?blocked=true')
  }

  getActiveUsers (): Observable<IUser[]> {
    return this.http.get<IUser[]>('admin/users?blocked=false')
  }
}
