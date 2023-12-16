/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
// import { StripeService } from 'ngx-stripe';
import { getLanguage } from 'src/app/helpers/movie';
import { formatTime } from 'src/app/helpers/timer';
import { ICSMovieRes } from 'src/app/models/movie';
import { ITheaterRes } from 'src/app/models/theater';
import { ITempTicketRes } from 'src/app/models/ticket';
import { TicketService } from 'src/app/services/ticket.service';
import { TICKET_EXPIRE_TIME } from 'src/app/shared/constants';
import { environments } from 'src/environments/environment';

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
  CineSnapCharge = 10

  getLanguage = getLanguage
  paymentHandler: any = null;
  elements: any;

  constructor (
    private readonly ticketService: TicketService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
    // private readonly stripeService: StripeService
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
    this.invokeStripe()
  }

  stripePayment (stripeToken: any): void {
    console.log('strip payment called')
    this.ticketService.makePayment(stripeToken).subscribe({
      next: (res) => {
        console.log(res, 'res from stripe payment')
      }
    })
  }

  payForTicket (): void {
    const paymentHandler = (window as any).StripeCheckout.configure({
      key: environments.stripePublishableKey,
      locale: 'auto',
      token: (stripeToken: any) => {
        console.log(stripeToken);
        // alert('Stripe token generated!');
        // making api request
        // this.ticketService.makePayment(stripeToken).subscribe({
        //   next: (res) => {
        //     console.log(res, 'res from stripe payment')
        //   }
        // })

        this.ticketService.confirmTicket(this.ticketId).subscribe({
          next: (res) => {
            if (res.data !== null) {
              // console.warn(res.data, 'confirmed ticket data')
              // console.log('recieved data from confirm ticket 11')
              void this.router.navigate(['/user/show/book/success', res.data._id])
            }
          }
        })
      }
    });
    paymentHandler.open({
      name: 'CineSnap',
      description: 'Book Movie Ticket',
      amount: Number(this.tempTicket.seatCount * this.CineSnapCharge + this.tempTicket.totalPrice * 100)
    });
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

  invokeStripe (): void {
    if (window.document.getElementById('stripe-script') == null) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (window as any).StripeCheckout.configure({
          key: environments.stripePublishableKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          }
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
