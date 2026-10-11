import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type IApiTicketRes, type ITicketsAndCount } from 'src/app/core/models/ticket.model'

@Injectable({ providedIn: 'root' })
export class TheaterTicketRepo {
  private readonly http = inject(HttpClient)

  getAllTicketsOfTheater (theaterId: string, page: number, limit: number): Observable<IApiRes<ITicketsAndCount | null>> {
    return this.http.get<IApiRes<ITicketsAndCount | null>>(`theater/tickets/${theaterId}?page=${page}&limit=${limit}`)
  }

  cancelTicketByTheater (ticketId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`theater/tickets/cancel/${ticketId}`, { cancelledBy: 'Theater' })
  }
}
