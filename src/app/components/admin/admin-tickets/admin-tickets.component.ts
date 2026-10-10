/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { type ITicketRes } from 'src/app/models/ticket'
import { TicketService } from 'src/app/services/ticket.service'
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { TableFilterComponent } from '../../common/table-filter/table-filter.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-admin-tickets',
    templateUrl: './admin-tickets.component.html',
    styleUrls: ['./admin-tickets.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AdminNavComponent, TableFilterComponent, DatePipe]
})
export class AdminTicketsComponent {
  private readonly ticketService = inject(TicketService)

  tickets: ITicketRes[] = []
  ticketCount = 0
  currPage = 1
  itemsPerPage = 10
  now = new Date()

  ngOnInit (): void {
    this.getTickets()
  }

  getDate (date: Date): Date {
    return new Date(date)
  }

  getTickets (): void {
    this.ticketService.getAllTickets(this.currPage, this.itemsPerPage).subscribe({
      next: (res) => {
        if (res.data !== null) {
          console.log(res.data, 'res from tickets of theater')
          this.tickets = res.data.tickets
          this.ticketCount = res.data.ticketCount
        }
      }
    })
  }

  onItemsPerPageChange (itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage
    this.currPage = 1
    this.getTickets()
  }

  onPageChange (page: number): void {
    this.currPage = page
    this.getTickets()
  }

  cancelTicket (ticketId: string): void {
    this.ticketService.cancelTicketByAdmin(ticketId).subscribe({
      next: () => {
        const ticketIdx = this.tickets.findIndex(tkt => tkt._id === ticketId)
        this.tickets = [
          ...this.tickets.slice(0, ticketIdx),
          { ...this.tickets[ticketIdx], isCancelled: true, cancelledBy: 'Admin' },
          ...this.tickets.slice(ticketIdx + 1)
        ]
      }
    })
  }
}
