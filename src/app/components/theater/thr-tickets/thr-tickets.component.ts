/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ITicketRes } from 'src/app/models/ticket'
import { TicketService } from 'src/app/services/ticket.service'

@Component({
  selector: 'app-thr-tickets',
  templateUrl: './thr-tickets.component.html',
  styleUrls: ['./thr-tickets.component.css']
})
export class ThrTicketsComponent implements OnInit {
  theaterId = ''
  tickets: ITicketRes[] = []
  ticketCount = 0
  currPage = 1
  itemsPerPage = 10

  constructor (
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService
  ) {
    this.route.params.subscribe(params => {
      this.theaterId = params['theaterId']
    })
  }

  ngOnInit (): void {
    this.getTickets()
  }

  getTickets (): void {
    this.ticketService.getAllTicketsOfTheater(this.theaterId, this.currPage, this.itemsPerPage).subscribe({
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
