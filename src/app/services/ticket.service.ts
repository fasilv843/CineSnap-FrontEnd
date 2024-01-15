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

  confirmTicket (ticketId: string, paymentMethod: string, useWallet: boolean, couponId: string | undefined): Observable<IApiTicketRes> {
    return this.http.post<IApiTicketRes>('user/show/book/confirm/ticket', { ticketId, couponId, paymentMethod, useWallet })
  }

  cancelTicket (ticketId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`user/ticket/cancel/${ticketId}`, { cancelledBy: 'User' })
  }

  cancelTicketByTheater (ticketId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`theater/tickets/cancel/${ticketId}`, { cancelledBy: 'Theater' })
  }

  cancelTicketByAdmin (ticketId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`admin/tickets/cancel/${ticketId}`, { cancelledBy: 'Admin' })
  }

  sendInvoiceRequest (ticketId: string): Observable<IApiRes<null>> {
    return this.http.post<IApiRes<null>>('user/tickets/invoice/mail', { ticketId })
  }
}
