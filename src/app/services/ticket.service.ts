/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { type ITicketReqs, IApiTempTicketRes, IApiTicketRes, IApiTicketsRes, ITicketsAndCount, IApiHoldSeatsRes } from '../models/ticket'
import { type Observable } from 'rxjs'
import { IApiRes } from '../models/common'

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

  getTicketData (ticketId: string): Observable<IApiTicketRes> {
    return this.http.get<IApiTicketRes>(`user/show/ticket/get/${ticketId}`)
  }

  getTicketsOfUser (userId: string): Observable<IApiTicketsRes> {
    return this.http.get<IApiTicketsRes>(`user/tickets/${userId}`)
  }

  getAllTicketsOfTheater (theaterId: string, page: number, limit: number): Observable<IApiRes<ITicketsAndCount | null>> {
    return this.http.get<IApiRes<ITicketsAndCount | null>>(`theater/tickets/${theaterId}?page=${page}&limit=${limit}`)
  }

  getAllTickets (page: number, limit: number): Observable<IApiRes<ITicketsAndCount | null>> {
    return this.http.get<IApiRes<ITicketsAndCount | null>>(`admin/tickets/all?page=${page}&limit=${limit}`)
  }

  getHoldedSeats (showId: string): Observable<IApiHoldSeatsRes> {
    return this.http.get<IApiHoldSeatsRes>(`user/show/seats/holded/${showId}`)
  }

  getTempTicketData (ticketId: string): Observable<IApiTempTicketRes> {
    return this.http.get<IApiTempTicketRes>(`user/tempticket/get/${ticketId}`)
  }

  makePayment (stripeToken: any): Observable<any> {
    return this.http.post('user/show/book/payment', { token: stripeToken })
  }

  confirmTicket (ticketId: string): Observable<IApiTicketRes> {
    return this.http.post<IApiTicketRes>('user/show/book/confirm/ticket', { ticketId })
  }

  cancelTicket (ticketId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`user/ticket/cancel/${ticketId}`, {})
  }

  cancelTicketByTheater (tikcetId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`theater/tickets/cancel/${tikcetId}`, {})
  }

  cancelTicketByAdmin (tikcetId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`admin/tickets/cancel/${tikcetId}`, {})
  }
}
