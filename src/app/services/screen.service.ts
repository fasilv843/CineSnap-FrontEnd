import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type IApiScreenRes, type IApiScreensRes, type IScreenRequirements } from '../models/screens'
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

  addScreen (screen: IScreenRequirements): Observable<IApiScreenRes> {
    return this.http.post<IApiScreenRes>(`theater/screens/add/${screen.theaterId}`, screen)
  }

  deleteScreen (screenId: string): Observable<IApiScreenRes> {
    return this.http.delete<IApiScreenRes>(`theater/screens/delete/${screenId}`)
  }

  editScreen (screen: IScreenRequirements, screenId: string): Observable<IApiScreenRes> {
    return this.http.put<IApiScreenRes>(`theater/screens/edit/${screenId}`, screen)
  }

  getScreenData (screenId: string): Observable<IApiScreenRes> {
    return this.http.get<IApiScreenRes>(`theater/screens/get/${screenId}`)
  }
}
