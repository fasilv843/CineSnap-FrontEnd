/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { IApiScreenSeatRes, IScreenSeatRes } from '../models/screenSeat'

@Injectable({
  providedIn: 'root'
})
export class ScreenSeatService {
  constructor (
    @Inject(HttpClient) private readonly http: HttpClient
  ) { }

  getScreenSeatData (screenSeatId: string): Observable<IApiScreenSeatRes> {
    return this.http.get<IApiScreenSeatRes>(`theater/screens/seat/${screenSeatId}`)
  }

  updateScreenSeat (screenSeatData: IScreenSeatRes): Observable<IApiScreenSeatRes> {
    return this.http.put<IApiScreenSeatRes>(`theater/screens/seat/update/${screenSeatData._id}`, { screenSeatData })
  }
}
