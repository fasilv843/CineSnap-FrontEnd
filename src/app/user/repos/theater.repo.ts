import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiTheaterRes, type IApiTheatersRes } from 'src/app/core/models/theater.model'

/** Theaters as a movie-goer browses them */
@Injectable({ providedIn: 'root' })
export class UserTheaterRepo {
  private readonly http = inject(HttpClient)

  getNearestTheaters (lon: number, lat: number): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>('user/theaters', {
      params: {
        longitude: lon.toString(),
        latitude: lat.toString()
      }
    })
  }

  getTheaterData (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.get<IApiTheaterRes>(`user/theater/${theaterId}`)
  }
}
