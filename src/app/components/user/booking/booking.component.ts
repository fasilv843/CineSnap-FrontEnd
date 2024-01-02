/* eslint-disable no-var */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getLanguage } from 'src/app/helpers/movie';
import { formatTime } from 'src/app/helpers/timer';
import { ICSMovieRes } from 'src/app/models/movie';
import { ITheaterRes } from 'src/app/models/theater';
import { ITempTicketRes } from 'src/app/models/ticket';
import { IUserRes } from 'src/app/models/users';
import { TicketService } from 'src/app/services/ticket.service';
import { TICKET_EXPIRE_TIME } from 'src/app/shared/constants';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { IRazorpayRes } from 'src/app/models/common';
import { RazorpayService } from 'src/app/services/razorpay.service';
import { Subscription } from 'rxjs';

// declare var Razorpay: any;
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, OnDestroy {
  userDetails$ = this.store.pipe(select(selectUserDetails))
  user!: IUserRes
  movie!: ICSMovieRes
  tempTicket!: ITempTicketRes
  ticketId = ''
  formattedTime = '10:00'
  remainingTime = 0
  theater!: ITheaterRes
  // seats: string[] = []
  // CineSnapCharge = ChargePerTicket
  private readonly paymentResultSubscription: Subscription;

  getLanguage = getLanguage

  constructor (
    private readonly ticketService: TicketService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly razorpayService: RazorpayService
  ) {
    this.paymentResultSubscription = this.razorpayService
      .getPaymentResultObservable()
      .subscribe((response: IRazorpayRes | null) => {
        if (response !== null) {
        // Payment was successful, handle accordingly
          console.log('Payment successful from component, confirming ticket');
          this.ticketService.confirmTicket(this.ticketId).subscribe({
            next: (res) => {
              if (res.data !== null) {
                void this.router.navigate(['/user/show/book/success', res.data._id])
              }
            }
          })
        } else {
        // Payment failed, handle accordingly
          console.log('Payment failed');
        }
      });
  }

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
          // Object.entries(res.data.seats).forEach(([row, cols]: [string, number[]]) => {
          //   cols.forEach(col => {
          //     this.seats.push(row + col)
          //   })
          // })

          // this.seats = this.seats.sort()
        }
      }
    })

    this.startTimer()
  }

  ngOnDestroy (): void {
    // Unsubscribe to avoid memory leaks
    this.paymentResultSubscription.unsubscribe();
  }

  payForTicket (amount: number): void {
    console.log('initiating razorpay payment');

    this.razorpayService.initiateRazorpayPayment(amount, {
      name: this.user.name,
      email: this.user.email,
      mobile: (this.user.mobile !== undefined) ? `${this.user.mobile}` : ''
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
