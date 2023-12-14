/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { type IApiTicketRes, type ITicketReqs } from '../models/ticket'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor (
    private readonly http: HttpClient
  ) { }

  bookTicket (ticketData: ITicketReqs): Observable<IApiTicketRes> {
    return this.http.post<IApiTicketRes>('user/book/ticket', { ticketData })
  }
}
