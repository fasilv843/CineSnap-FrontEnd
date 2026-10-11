import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type IApiHoldSeatsRes, type IApiTempTicketRes, type IApiTicketRes, type IApiTicketsRes, type ITicketReqs } from 'src/app/core/models/ticket.model'

@Injectable({ providedIn: 'root' })
export class UserTicketRepo {
  private readonly http = inject(HttpClient)

  bookTicket (ticketReqs: ITicketReqs): Observable<IApiTempTicketRes> {
    return this.http.post<IApiTempTicketRes>('user/book/ticket', { ticketReqs })
  }

  getTicketData (ticketId: string): Observable<IApiTicketRes> {
    return this.http.get<IApiTicketRes>(`user/show/ticket/get/${ticketId}`)
  }

  getTicketsOfUser (userId: string): Observable<IApiTicketsRes> {
    return this.http.get<IApiTicketsRes>(`user/tickets/${userId}`)
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

  sendInvoiceRequest (ticketId: string): Observable<IApiRes<null>> {
    return this.http.post<IApiRes<null>>('user/tickets/invoice/mail', { ticketId })
  }
}
