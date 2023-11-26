import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type IApiScreensRes } from '../models/screens'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  constructor (
    @Inject(HttpClient) private readonly http: HttpClient
  ) { }

  findScreens (theaterId: string): Observable<IApiScreensRes> {
    return this.http.get<IApiScreensRes>(`theater/screens/${theaterId}`)
  }
}
