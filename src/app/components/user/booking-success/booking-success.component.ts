/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { getLanguage } from 'src/app/helpers/movie'
import { ITicketRes } from 'src/app/models/ticket'
import { TicketService } from 'src/app/services/ticket.service'

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit {
  ticketId = ''
  ticket!: ITicketRes
  // seats: string[] = []
  getLanguage = getLanguage

  constructor (
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService
  ) {
    this.route.params.subscribe(params => {
      this.ticketId = params['ticketId']
    })
  }

  ngOnInit (): void {
    console.log(this.ticketId, 'ticketId from success component')

    // this.ticketService.getTicketData(this.ticketId).subscribe({
    //   next: (res) => {
    //     if (res.data !== null) {
    //       console.warn(res.data, 'res data from get ticket data')
    //       this.ticket = res.data
    //       Object.entries(res.data.seats).forEach(([row, cols]: [string, number[]]) => {
    //         cols.forEach(col => {
    //           this.seats.push(row + col)
    //         })
    //       })
    //     }
    //   }
    // })
  }
}
