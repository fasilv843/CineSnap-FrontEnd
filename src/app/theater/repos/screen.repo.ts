import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type IApiScreenRes, type IApiScreensRes, type IAvailCatsOnScreen, type IScreenRequirements } from '../../core/models/screen.model'
import { type Observable } from 'rxjs'
import { type IApiRes } from '../../core/models/api.model'

@Injectable({
  providedIn: 'root'
})
export class TheaterScreenRepo {
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

  updateScreenName (screenId: string, screenName: string): Observable<IApiScreenRes> {
    return this.http.patch<IApiScreenRes>(`theater/screens/edit/${screenId}`, { screenName })
  }

  getScreenData (screenId: string): Observable<IApiScreenRes> {
    return this.http.get<IApiScreenRes>(`theater/screens/get/${screenId}`)
  }

  getAvailSeatsOnScreen (screenId: string): Observable<IApiRes<IAvailCatsOnScreen | null>> {
    return this.http.get<IApiRes<IAvailCatsOnScreen | null>>(`theater/screens/get/seats/${screenId}`)
  }
}
