/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { getLanguage } from 'src/app/helpers/movie';
import { formatTime } from 'src/app/helpers/timer';
import { ICSMovieRes } from 'src/app/models/movie';
import { ITheaterRes } from 'src/app/models/theater';
import { ITempTicketRes } from 'src/app/models/ticket';
import { TicketService } from 'src/app/services/ticket.service';
import { TICKET_EXPIRE_TIME } from 'src/app/shared/constants';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  movie!: ICSMovieRes
  tempTicket!: ITempTicketRes
  ticketId = ''
  formattedTime = '10:00'
  remainingTime = 0
  theater!: ITheaterRes
  seats: string[] = []
  getLanguage = getLanguage

  constructor (
    private readonly ticketService: TicketService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.ticketId = params['ticketId']
      console.log('ticketId', this.ticketId, 'from booking comp, route')
    })

    console.log('getting temp ticket with ticketId : ', this.ticketId)
    this.ticketService.getTempTicketData(this.ticketId).subscribe({
      next: (res) => {
        if (res.data != null) {
          console.log(res.data, 'res data from getTempTicketData')
          this.tempTicket = res.data
          this.movie = res.data.movieId
          this.theater = res.data.theaterId
          Object.entries(res.data.seats).forEach(([row, cols]: [string, number[]]) => {
            cols.forEach(col => {
              this.seats.push(row + col)
            })
          })

          this.seats = this.seats.sort()
        }
      }
    })

    this.startTimer()
  }

  startTimer (): void {
    this.remainingTime = TICKET_EXPIRE_TIME;

    const timer = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(timer)
      }
      this.formattedTime = formatTime(this.remainingTime)
    }, 1000); // Update every second
  }
}
