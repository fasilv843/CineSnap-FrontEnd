/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiTheaterRes, IApiTheatersRes, ITheaterUpdate } from '../models/theater';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  constructor (
    private readonly http: HttpClient
  ) { }

  getAllTheaters (): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>('admin/theaters')
  }

  blockTheater (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`admin/theaters/block/${theaterId}`, {})
  }

  getBlockedTheaters (): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>('admin/theaters?blocked=true')
  }

  getActiveTheaters (): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>('admin/theaters?blocked=false')
  }

  getNearestTheaters (lon: number, lat: number): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>('user/theaters', {
      params: {
        longitude: lon.toString(),
        latitude: lat.toString()
      }
    })
  }

  updatetheaterDetails (theaterId: string, theater: ITheaterUpdate): Observable<IApiTheaterRes> {
    return this.http.put<IApiTheaterRes>(`theater/update/${theaterId}`, theater)
  }
}
