/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { IApiSeatsRes, type IApiTicketRes, type ITicketReqs, IApiTempTicketRes } from '../models/ticket'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor (
    private readonly http: HttpClient
  ) { }

  bookTicket (ticketReqs: ITicketReqs): Observable<IApiTempTicketRes> {
    console.log(ticketReqs, 'ticket data that passed to backend')
    return this.http.post<IApiTempTicketRes>('user/book/ticket', { ticketReqs })
  }

  getHoldedSeats (showId: string): Observable<IApiSeatsRes> {
    return this.http.get<IApiSeatsRes>(`user/show/seats/holded/${showId}`)
  }

  getTempTicketData (ticketId: string): Observable<IApiTempTicketRes> {
    return this.http.get<IApiTempTicketRes>(`user/tempticket/get/${ticketId}`)
  }
}
