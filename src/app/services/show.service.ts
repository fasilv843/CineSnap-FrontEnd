import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiShowRes, type IShowRequirements, type IApiShowsRes } from '../models/show'

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  constructor (
    @Inject(HttpClient) private readonly http: HttpClient
  ) { }

  findShowsOnDate (theaterId: string, date: string): Observable<IApiShowsRes> {
    return this.http.get<IApiShowsRes>(`user/shows/${theaterId}?date=${date}`)
  }

  addShow (show: IShowRequirements): Observable<IApiShowRes> {
    return this.http.post<IApiShowRes>('theater/show/add', show)
  }

  getShowDetails (showId: string): Observable<IApiShowRes> {
    return this.http.get<IApiShowRes>(`user/theater/show/get/${showId}`)
  }
}
