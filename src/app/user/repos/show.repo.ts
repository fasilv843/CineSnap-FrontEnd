import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type IApiShowRes, type IApiShowsRes } from 'src/app/core/models/show.model'
import { type IShowSeatsRes } from 'src/app/core/models/show-seat.model'

@Injectable({ providedIn: 'root' })
export class UserShowRepo {
  private readonly http = inject(HttpClient)

  findShowsOnDate (theaterId: string, date: string): Observable<IApiShowsRes> {
    return this.http.get<IApiShowsRes>(`user/shows/${theaterId}?date=${date}`)
  }

  getShowDetails (showId: string): Observable<IApiShowRes> {
    return this.http.get<IApiShowRes>(`user/theater/show/get/${showId}`)
  }

  getShowSeatDetails (showSeatId: string): Observable<IApiRes<IShowSeatsRes | null>> {
    return this.http.get<IApiRes<IShowSeatsRes | null>>(`user/shows/seats/${showSeatId}`)
  }
}
