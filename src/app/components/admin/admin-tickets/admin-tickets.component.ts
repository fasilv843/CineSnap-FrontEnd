/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { type ITicketRes } from 'src/app/models/ticket'
import { TicketService } from 'src/app/services/ticket.service'

@Component({
  selector: 'app-admin-tickets',
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.css']
})
export class AdminTicketsComponent {
  tickets: ITicketRes[] = []
  ticketCount = 0
  currPage = 1
  itemsPerPage = 10

  constructor (
    private readonly ticketService: TicketService
  ) {}

  ngOnInit (): void {
    this.getTickets()
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

  }
}
