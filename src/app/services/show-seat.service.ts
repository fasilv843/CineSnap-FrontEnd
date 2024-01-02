import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IShowSeatsRes } from '../models/showSeat'
import { type IApiRes } from '../models/common'

@Injectable({
  providedIn: 'root'
})
export class ShowSeatService {
  constructor (
    @Inject(HttpClient) private readonly http: HttpClient
  ) { }

  getShowSeatDetails (showSeatId: string): Observable<IApiRes<IShowSeatsRes | null>> {
    return this.http.get<IApiRes<IShowSeatsRes | null>>(`user/shows/seats/${showSeatId}`)
  }
}
