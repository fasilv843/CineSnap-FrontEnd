/* eslint-disable no-var */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getLanguage } from 'src/app/helpers/movie';
import { formatTime } from 'src/app/helpers/timer';
import { ICSMovieRes } from 'src/app/models/movie';
import { ITheaterRes } from 'src/app/models/theater';
import { ITempTicketRes } from 'src/app/models/ticket';
import { IUserRes } from 'src/app/models/users';
import { TicketService } from 'src/app/services/ticket.service';
import { ChargePerTicket, TICKET_EXPIRE_TIME } from 'src/app/shared/constants';
import { environments } from 'src/environments/environment';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { IRazorpayRes } from 'src/app/models/common';

declare var Razorpay: any;
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  userDetails$ = this.store.pipe(select(selectUserDetails))
  user!: IUserRes
  movie!: ICSMovieRes
  tempTicket!: ITempTicketRes
  ticketId = ''
  formattedTime = '10:00'
  remainingTime = 0
  theater!: ITheaterRes
  seats: string[] = []
  CineSnapCharge = ChargePerTicket

  getLanguage = getLanguage

  constructor (
    private readonly ticketService: TicketService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store
    // private readonly razorpayService: RazorpayService
  ) { }

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.ticketId = params['ticketId']
      console.log('ticketId', this.ticketId, 'from booking comp, route')
    })

    this.userDetails$.subscribe(user => {
      if (user !== null) {
        this.user = user
      }
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

  options = {
    "key": environments.razorpayPublicKey,
    "amount": 1000000000, // amount in paise (Rupees x 100)
    "currency": 'INR',
    "name": 'CineSnap',
    "description": 'Payment for Booking Movie',
    "image": '../../../assets/logo-1x1.png',
    "order_id": '', // Replace with your order ID
    "handler": function (response: IRazorpayRes) {
      console.log(response, 'responce from razorpay handler')
      console.warn('handling success functions')
      // Handle the success callback
      var event = new CustomEvent("payment.success",
        { detail: response }
      );
      window.dispatchEvent(event)
    },
    "prefill": {
      "name": '',
      "email": '',
      "contact": ''
    },
    "notes": {
      "address": 'CineSnap Private Limited'
    },
    "theme": {
      "color": '#f2bd00'
    }
  }

  payForTicket (amount: number): void {
    console.log('initiating razorpay payment');

    this.options.prefill.name = this.user.name
    this.options.prefill.email = this.user.email
    this.options.prefill.contact = (this.user.mobile !== undefined) ? `${this.user.mobile}` : '';
    this.options.amount = amount * 100

    var rzp1 = new Razorpay(this.options);
    rzp1.open();
    rzp1.on('payment.failed', function (response: any) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
    });
  }

  @HostListener('window:payment.success', ['$event'])
  onPaymentSuccess (response: IRazorpayRes): void {
    console.log(response, 'event data from razorpay');
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
