import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiShowRes, type IApiShowsRes, type IShowRequirements } from 'src/app/core/models/show.model'

@Injectable({ providedIn: 'root' })
export class TheaterShowRepo {
  private readonly http = inject(HttpClient)

  findShowsOnDateForTheater (theaterId: string, date: string): Observable<IApiShowsRes> {
    return this.http.get<IApiShowsRes>(`theater/shows/${theaterId}?date=${date}`)
  }

  addShow (show: IShowRequirements): Observable<IApiShowRes> {
    return this.http.post<IApiShowRes>('theater/show/add', show)
  }
}
