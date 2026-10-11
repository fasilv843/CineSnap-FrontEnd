import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type IApiTheaterRes, type IApiTheatersRes, type ITheatersAndCount } from 'src/app/core/models/theater.model'

@Injectable({ providedIn: 'root' })
export class AdminTheaterRepo {
  private readonly http = inject(HttpClient)

  getAllTheaters (page: number, limit: number, searchQuery: string): Observable<IApiRes<ITheatersAndCount | null>> {
    return this.http.get<IApiRes<ITheatersAndCount | null>>(`admin/theaters?page=${page}&limit=${limit}&searchQuery=${encodeURIComponent(searchQuery)}`)
  }

  blockTheater (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`admin/theaters/block/${theaterId}`, {})
  }

  approveTheater (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`admin/theaters/approval/${theaterId}?action=approve`, {})
  }

  rejectTheater (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`admin/theaters/approval/${theaterId}?action=reject`, {})
  }

  getBlockedTheaters (): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>('admin/theaters?blocked=true')
  }

  getActiveTheaters (): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>('admin/theaters?blocked=false')
  }
}
