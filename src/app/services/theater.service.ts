/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiTheaterRes, IApiTheatersRes, ITheaterUpdate, ITheatersAndCount } from '../models/theater';
import { IApiChatRes } from '../models/chat';
import { IApiRes } from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  constructor (
    private readonly http: HttpClient
  ) { }

  getAllTheaters (page: number, limit: number, searchQuery: string): Observable<IApiRes<ITheatersAndCount | null>> {
    return this.http.get<IApiRes<ITheatersAndCount | null>>(`admin/theaters?page=${page}&limit=${limit}&searchQuery=${searchQuery}`)
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

  markLastMessageAsRead (userId: string | undefined, theaterId: string | undefined, adminId: string | undefined, msgId: string): Observable<IApiRes<null>> {
    // if (userId === undefined || userId === null) userId = ''
    // if (theaterId === undefined || userId === null) theaterId = ''
    // if (adminId === undefined || userId === null) adminId = ''
    return this.http.patch<IApiRes<null>>(`theater/chat/mark/read?userId=${userId ?? ''}&theaterId=${theaterId ?? ''}&adminId=${adminId ?? ''}&msgId=${msgId}`, {})
  }
}
