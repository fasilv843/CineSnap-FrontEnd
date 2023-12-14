/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { IApiSeatsRes, type IApiTicketRes, type ITicketReqs } from '../models/ticket'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor (
    private readonly http: HttpClient
  ) { }

  bookTicket (ticketReqs: ITicketReqs): Observable<IApiTicketRes> {
    console.log(ticketReqs, 'ticket data that passed to backend')
    return this.http.post<IApiTicketRes>('user/book/ticket', { ticketReqs })
  }

  getHoldedSeats (showId: string): Observable<IApiSeatsRes> {
    return this.http.get<IApiSeatsRes>(`user/show/seats/holded/${showId}`)
  }
}
