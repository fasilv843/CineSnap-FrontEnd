/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiTheaterRes, IApiTheatersRes, ITheaterUpdate } from '../models/theater';
import { IApiChatRes } from '../models/chat';

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

  approveTheater (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`admin/theaters/approval/${theaterId}?action=approve`, {})
  }

  rejectTheater (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`admin/theaters/approval/${theaterId}?action=reject`, {})
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

  getTheaterData (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.get<IApiTheaterRes>(`user/theater/${theaterId}`)
  }

  getTheatersChattedWith (userId: string): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>(`user/chat/theaters/${userId}`)
  }

  getChatHistory (theaterId: string, userId: string): Observable<IApiChatRes> {
    return this.http.get<IApiChatRes>(`theater/chat/history?theaterId=${theaterId}&userId=${userId}`)
  }

  updateTheaterProfilePic (theaterId: string, formData: FormData): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`theater/update/profileimage/${theaterId}`, formData)
  }

  deleteTheaterProfilePic (theaterId: string): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`theater/remove/profileimage/${theaterId}`, {})
  }

  updateTheaterWallet (theaterId: string, amount: number): Observable<IApiTheaterRes> {
    return this.http.patch<IApiTheaterRes>(`theater/wallet/add/${theaterId}`, { amount })
  }
}
