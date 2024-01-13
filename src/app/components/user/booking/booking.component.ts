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
import { ITempTicketRes, ITicketSeat } from 'src/app/models/ticket';
import { IUserRes } from 'src/app/models/users';
import { TicketService } from 'src/app/services/ticket.service';
import { TICKET_EXPIRE_TIME } from 'src/app/shared/constants';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { IRazorpayRes } from 'src/app/models/common';
import { RazorpayService } from 'src/app/services/razorpay.service';
import { Subscription } from 'rxjs';
import { CouponService } from 'src/app/services/coupon.service';
import { ICouponRes } from 'src/app/models/coupon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponModalComponent } from '../coupon-modal/coupon-modal.component';

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
  seats: string[] = []
  coupons: ICouponRes[] = []
  appliedCouponId = ''
  appliedCoupon: ICouponRes | undefined
  suggestionCoupon!: ICouponRes
  paymentMethod: 'Razorpay' | 'Wallet' = 'Razorpay'
  useWallet = false

  diamondSeats?: ITicketSeat
  goldSeats?: ITicketSeat
  silverSeats?: ITicketSeat

  private readonly paymentResultSubscription: Subscription;

  getLanguage = getLanguage

  constructor (
    private readonly ticketService: TicketService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly razorpayService: RazorpayService,
    private readonly couponService: CouponService,
    private readonly ngbModal: NgbModal
  ) {
    this.paymentResultSubscription = this.razorpayService
      .getPaymentResultObservable()
      .subscribe((response: IRazorpayRes | null) => {
        if (response !== null) {
        // Payment was successful, handle accordingly
          console.log('Payment successful from component, confirming ticket');
          this.confirmTicket()
        } else {
        // Payment failed, handle accordingly
          console.log('Payment failed');
        }
      });
  }

  confirmTicket (): void {
    this.ticketService.confirmTicket(this.ticketId, this.paymentMethod, this.useWallet, this.appliedCoupon?._id).subscribe({
      next: (res) => {
        if (res.data !== null) {
          void this.router.navigate(['/user/show/book/success', res.data._id])
        }
      }
    })
  }

  toggleUsewallet (): void {
    this.useWallet = !this.useWallet
  }

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.ticketId = params['ticketId']
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
          this.tempTicket = res.data
          this.movie = res.data.movieId
          this.theater = res.data.theaterId
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

    this.couponService.getApplicableCouopns(this.user._id, this.ticketId).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.coupons = res.data
          this.suggestionCoupon = this.coupons[0]
        }
      }
    })

    this.startTimer()
  }

  ngOnDestroy (): void {
    // Unsubscribe to avoid memory leaks
    this.paymentResultSubscription.unsubscribe();
  }

  showCouponsModal (): void {
    console.warn('show more button clicked, but didnt implemented');
    const modalRef = this.ngbModal.open(CouponModalComponent, { backdrop: 'static', centered: true })
    modalRef.componentInstance.coupons = this.coupons
    modalRef.componentInstance.appliedCouponId = this.appliedCouponId

    void modalRef.result.then(
      (result: ICouponRes) => {
        if (result._id === this.appliedCouponId) {
          this.appliedCouponId = ''
          this.appliedCoupon = undefined
        } else {
          console.log(result, 'result of coupon modal')
          this.appliedCouponId = result._id
          this.suggestionCoupon = result
          this.appliedCoupon = this.suggestionCoupon
        }
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason)
      }
    )
  }

  calculateTheaterShare (ticket: ITempTicketRes): number {
    let price = 0
    if (ticket.diamondSeats !== undefined) {
      price += ticket.diamondSeats.seats.length * ticket.diamondSeats.singlePrice
    }
    if (ticket.goldSeats !== undefined) {
      price += ticket.goldSeats.seats.length * ticket.goldSeats.singlePrice
    }
    if (ticket.silverSeats !== undefined) {
      price += ticket.silverSeats.seats.length * ticket.silverSeats.singlePrice
    }
    return price
  }

  getDiscountedAmt (appliedCoupon: ICouponRes | undefined): number {
    if (appliedCoupon === undefined) return 0
    if (appliedCoupon.discountType === 'Fixed Amount') {
      return appliedCoupon.discount
    } else if (appliedCoupon.discountType === 'Percentage') {
      const totalTicketPrice = this.calculateTheaterShare(this.tempTicket)
      return (totalTicketPrice / 100) * appliedCoupon.discount
    }
    return 0 // never reaches here, discountType only can be 2 types
  }

  applyCoupon (suggestionCoupon: ICouponRes): void {
    if (suggestionCoupon._id === this.appliedCouponId) {
      this.appliedCouponId = ''
      this.appliedCoupon = undefined
    } else {
      this.appliedCouponId = suggestionCoupon._id
      this.appliedCoupon = suggestionCoupon
    }
  }

  getPayAmount (): number {
    const price = this.tempTicket.totalPrice - this.getDiscountedAmt(this.appliedCoupon)
    return this.useWallet ? price - this.user.wallet : price
  }

  payForTicket (amount: number): void {
    if (this.paymentMethod === 'Razorpay') {
      if (this.useWallet) amount -= this.user.wallet
      this.razorpayService.initiateRazorpayPayment(amount, {
        name: this.user.name,
        email: this.user.email,
        mobile: (this.user.mobile !== undefined) ? `${this.user.mobile}` : ''
      })
    } else if (this.paymentMethod === 'Wallet') {
      this.confirmTicket()
    }
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
