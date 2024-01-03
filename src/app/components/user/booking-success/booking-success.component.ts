/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { getLanguage } from 'src/app/helpers/movie'
import { ITicketRes, ITicketSeat } from 'src/app/models/ticket'
import { TicketService } from 'src/app/services/ticket.service'

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit {
  ticketId = ''
  userId = ''
  ticket!: ITicketRes
  seats: string[] = []

  diamondSeats?: ITicketSeat
  goldSeats?: ITicketSeat
  silverSeats?: ITicketSeat

  getLanguage = getLanguage

  constructor (
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ticketService: TicketService
  ) {
    this.route.params.subscribe(params => {
      this.ticketId = params['ticketId']
    })
  }

  ngOnInit (): void {
    console.log(this.ticketId, 'ticketId from success component')

    this.ticketService.getTicketData(this.ticketId).subscribe({
      next: (res) => {
        if (res.data !== null) {
          console.warn(res.data, 'res data from get ticket data')
          this.ticket = res.data
          this.userId = res.data.userId as unknown as string
          if (res.data.diamondSeats !== undefined) {
            this.diamondSeats = res.data.diamondSeats
            this.seats = [...this.seats, ...res.data.diamondSeats.seats]
          }
          if (res.data.goldSeats !== undefined) {
            this.goldSeats = res.data.goldSeats
            this.seats = [...this.seats, ...res.data.goldSeats.seats]
          }
          if (res.data.silverSeats !== undefined) {
            this.silverSeats = res.data.silverSeats
            this.seats = [...this.seats, ...res.data.silverSeats.seats]
          }
          this.seats = this.seats.sort()
        }
      }
    })
  }

  openBookings (): void {
    void this.router.navigate(['/user/bookings', this.userId])
  }
}
