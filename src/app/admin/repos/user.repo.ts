import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type IApiUserRes, type IApiUsersRes, type IUsersAndCount } from 'src/app/core/models/user.model'

@Injectable({ providedIn: 'root' })
export class AdminUserRepo {
  private readonly http = inject(HttpClient)

  getAllUsers (page: number, limit: number, searchQuery: string): Observable<IApiRes<IUsersAndCount | null>> {
    return this.http.get<IApiRes<IUsersAndCount | null>>(`admin/users?page=${page}&limit=${limit}&searchQuery=${encodeURIComponent(searchQuery)}`)
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
