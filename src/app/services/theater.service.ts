/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITheater } from '../models/theater';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  constructor (
    private readonly http: HttpClient
  ) { }

  getAllTheaters (): Observable<any> {
    return this.http.get('admin/theaters')
  }

  blockTheater (theaterId: string): Observable<ITheater> {
    return this.http.patch<ITheater>(`admin/theaters/block/${theaterId}`, {})
  }

  getBlockedTheaters (): Observable<ITheater[]> {
    return this.http.get<ITheater[]>('admin/theaters?blocked=true')
  }

  getActiveTheaters (): Observable<ITheater[]> {
    return this.http.get<ITheater[]>('admin/theaters?blocked=false')
  }
}
