import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { interval, map, of } from 'rxjs'
import { toMovieCard } from 'src/app/shared/utils/movie-card'
import { formatTime } from 'src/app/shared/utils/timer'
import { type ICouponRes } from 'src/app/core/models/coupon.model'
import { type ITempTicketView, type ITicketSeat } from 'src/app/core/models/ticket.model'
import { UserCouponRepo } from 'src/app/user/repos/coupon.repo'
import { UserTicketRepo } from 'src/app/user/repos/ticket.repo'
import { ModalService } from 'src/app/shared/ui/modal.service'
import { RazorpayService } from 'src/app/shared/services/razorpay.service'
import { TICKET_EXPIRE_TIME } from 'src/app/core/constants/constants'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { adjustUserWallet } from 'src/app/core/state/user/user.actions'
import { selectUserDetails } from 'src/app/core/state/user/user.selector'
import { CouponModalComponent } from '../../components/coupon-modal/coupon-modal.component'
import { UserNavComponent } from '../../layout/user-nav/user-nav.component'
import { valueOf } from 'src/app/shared/utils/resource'

type PaymentMethod = 'Razorpay' | 'Wallet'

/** Ticket price before the booking fee; coupons only discount this part */
function ticketShare (ticket: ITempTicketView): number {
  return [ticket.diamondSeats, ticket.goldSeats, ticket.silverSeats]
    .reduce((sum, line) => sum + (line !== undefined ? line.seats.length * line.singlePrice : 0), 0)
}

@Component({
  selector: 'app-booking',
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, DatePipe, ButtonDirective, StatePanelComponent]
})
export class UserCheckoutComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly store = inject(Store)
  private readonly couponRepo = inject(UserCouponRepo)
  private readonly ticketRepo = inject(UserTicketRepo)
  private readonly razorpayService = inject(RazorpayService)
  private readonly modalService = inject(ModalService)

  protected readonly user = this.store.selectSignal(selectUserDetails)
  private readonly params = toSignal(this.route.paramMap, { requireSync: true })
  protected readonly ticketId = computed(() => this.params().get('ticketId') ?? '')

  protected readonly ticket = rxResource({
    params: () => this.ticketId(),
    stream: ({ params }) => this.ticketRepo.getTempTicketData(params).pipe(map(res => res.data as ITempTicketView | null))
  })

  protected readonly coupons = rxResource({
    params: () => ({ userId: this.user()?._id ?? '', ticketId: this.ticketId() }),
    stream: ({ params }) => params.userId === ''
      ? of([])
      : this.couponRepo.getApplicableCouopns(params.userId, params.ticketId).pipe(map(res => res.data ?? []))
  })

  // Countdown to when the held seats are released
  private readonly openedAt = Date.now()
  private readonly now = toSignal(interval(1000).pipe(map(() => Date.now())), { initialValue: Date.now() })
  private readonly expiresAt = computed(() => {
    const expireAt = valueOf(this.ticket)?.expireAt
    // expireAt is when the hold was created; MongoDB's TTL index removes the ticket TICKET_EXPIRE_TIME later
    const createdAt = expireAt !== undefined ? new Date(expireAt).getTime() : this.openedAt
    return createdAt + TICKET_EXPIRE_TIME * 1000
  })

  protected readonly secondsLeft = computed(() => Math.max(0, Math.floor((this.expiresAt() - this.now()) / 1000)))
  protected readonly timeLeft = computed(() => formatTime(this.secondsLeft()))
  protected readonly expired = computed(() => valueOf(this.ticket) != null && this.secondsLeft() === 0)

  protected readonly movie = computed(() => {
    const movie = valueOf(this.ticket)?.movieId
    return movie != null ? toMovieCard(movie) : null
  })

  protected readonly lines = computed(() => {
    const ticket = valueOf(this.ticket)
    if (ticket == null) return []
    return [ticket.diamondSeats, ticket.goldSeats, ticket.silverSeats]
      .filter((line): line is ITicketSeat => line !== undefined && line.seats.length > 0)
  })

  protected readonly seats = computed(() => this.lines().flatMap(line => line.seats).sort())
  protected readonly fees = computed(() => this.lines().reduce((sum, line) => sum + line.CSFeePerTicket * line.seats.length, 0))

  protected readonly appliedCoupon = signal<ICouponRes | null>(null)
  // The first coupon is offered inline; the rest are one tap away
  protected readonly suggestedCoupon = computed(() => this.appliedCoupon() ?? valueOf(this.coupons)?.[0] ?? null)

  protected readonly discount = computed(() => {
    const coupon = this.appliedCoupon()
    const ticket = valueOf(this.ticket)
    if (coupon === null || ticket == null) return 0
    const amount = coupon.discountType === 'Fixed Amount' ? coupon.discount : (ticketShare(ticket) / 100) * coupon.discount
    return Math.round(amount)
  })

  protected readonly total = computed(() => Math.max(0, (valueOf(this.ticket)?.totalPrice ?? 0) - this.discount()))
  protected readonly wallet = computed(() => this.user()?.wallet ?? 0)
  protected readonly walletCovers = computed(() => this.wallet() >= this.total())

  protected readonly method = signal<PaymentMethod>('Razorpay')
  protected readonly useWallet = signal(false)

  /** What the payer is charged now (by Razorpay, or from the wallet) */
  protected readonly payable = computed(() => {
    if (this.walletCovers()) return this.total()
    return this.useWallet() ? Math.max(0, this.total() - this.wallet()) : this.total()
  })

  protected readonly paying = signal(false)
  protected readonly theaterLink = computed(() => {
    const theaterId = valueOf(this.ticket)?.theaterId?._id
    return theaterId !== undefined ? ['/user/theater', theaterId] : ['/user/theaters']
  })

  protected toggleCoupon (coupon: ICouponRes): void {
    this.appliedCoupon.update(applied => applied?._id === coupon._id ? null : coupon)
  }

  protected showAllCoupons (): void {
    const ref = this.modalService.open(CouponModalComponent)
    ref.componentInstance.coupons.set(valueOf(this.coupons) ?? [])
    ref.componentInstance.appliedId.set(this.appliedCoupon()?._id ?? null)
    ref.result.then((coupon: ICouponRes) => { this.toggleCoupon(coupon) }, () => {})
  }

  protected async pay (): Promise<void> {
    const user = this.user()
    if (user === null || this.paying() || this.expired()) return
    this.paying.set(true)

    const payWithWallet = this.walletCovers() && this.method() === 'Wallet'
    if (!payWithWallet) {
      const payment = await this.razorpayService.pay(this.payable(), {
        name: user.name,
        email: user.email,
        mobile: user.mobile !== undefined ? `${user.mobile}` : ''
      })
      if (payment === null) { this.paying.set(false); return } // checkout closed
    }

    const method: PaymentMethod = payWithWallet ? 'Wallet' : 'Razorpay'
    const partWallet = !this.walletCovers() && this.useWallet()
    this.ticketRepo.confirmTicket(this.ticketId(), method, partWallet, this.appliedCoupon()?._id).subscribe({
      next: res => {
        if (res.data === null) { this.paying.set(false); return }
        // Mirror the backend's wallet debit: a wallet payment takes the full ticket price (it ignores the coupon),
        // part-paying takes the whole balance (GET user/get/:id crashes the backend, so the user isn't refetched)
        const walletUsed = method === 'Wallet' ? (valueOf(this.ticket)?.totalPrice ?? 0) : partWallet ? user.wallet : 0
        if (walletUsed > 0) this.store.dispatch(adjustUserWallet({ by: -walletUsed }))
        void this.router.navigate(['/user/show/book/success', res.data._id], { replaceUrl: true })
      },
      error: () => { this.paying.set(false) }
    })
  }
}
