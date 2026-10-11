import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type IApiTicketRes, type ITicketsAndCount } from 'src/app/core/models/ticket.model'

@Injectable({ providedIn: 'root' })
export class AdminTicketRepo {
  private readonly http = inject(HttpClient)

  getAllTickets (page: number, limit: number): Observable<IApiRes<ITicketsAndCount | null>> {
    return this.http.get<IApiRes<ITicketsAndCount | null>>(`admin/tickets/all?page=${page}&limit=${limit}`)
  }

  cancelTicketByAdmin (ticketId: string): Observable<IApiTicketRes> {
    return this.http.patch<IApiTicketRes>(`admin/tickets/cancel/${ticketId}`, { cancelledBy: 'Admin' })
  }
}
