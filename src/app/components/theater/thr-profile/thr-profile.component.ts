import { Component, Inject, type OnDestroy, type OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store, select } from '@ngrx/store'
import { type ITheaterRes } from 'src/app/models/theater'
import { deleteTheaterFromStore, saveTheaterOnStore } from 'src/app/states/theater/theater.action'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { environments } from 'src/environments/environment'
import { AddToWalletModalComponent } from '../../common/add-to-wallet-modal/add-to-wallet-modal.component'
import { RazorpayService } from 'src/app/services/razorpay.service'
import { type Subscription } from 'rxjs'
import { type IRazorpayRes } from 'src/app/models/common'
import { TheaterService } from 'src/app/services/theater.service'

@Component({
  selector: 'app-thr-profile',
  templateUrl: './thr-profile.component.html',
  styleUrls: ['./thr-profile.component.css']
})
export class ThrProfileComponent implements OnInit, OnDestroy {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  theater!: ITheaterRes
  profilePic: string = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'
  amountToAdd: number = 0
  private readonly paymentResultSubscription: Subscription
  theaterId = ''

  constructor (
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router,
    @Inject(NgbModal) private readonly ngbModal: NgbModal,
    @Inject(RazorpayService) private readonly razorpayService: RazorpayService,
    @Inject(TheaterService) private readonly theaterService: TheaterService
  ) {
    this.paymentResultSubscription = this.razorpayService
      .getPaymentResultObservable()
      .subscribe((response: IRazorpayRes | null) => {
        if (response !== null) {
          // Payment was successful, handle accordingly
          this.theaterService.updateTheaterWallet(this.theaterId, this.amountToAdd).subscribe({
            next: (res) => {
              this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data }))
              this.theater.wallet = res.data.wallet
            }
          })
        } else {
          // Payment failed, handle accordingly
          console.log('Payment failed')
        }
      })
  }

  ngOnInit (): void {
    this.theaterDetails$.subscribe((theater) => {
      if (theater !== null) {
        this.theater = theater
        this.theaterId = theater._id
        if (theater.profilePic !== undefined) this.profilePic = environments.backendUrl + `/images/${theater.profilePic}`
      }
    })
  }

  ngOnDestroy (): void {
    this.paymentResultSubscription.unsubscribe()
  }

  addToWallet (): void {
    const modalRef = this.ngbModal.open(AddToWalletModalComponent, { backdrop: 'static', centered: true })

    void modalRef.result.then(
      (result: { amount: number }) => {
        console.log('submitted form data', result)
        this.amountToAdd = result.amount
        this.razorpayService.initiateRazorpayPayment(result.amount, {
          name: this.theater.name,
          email: this.theater.email,
          mobile: (this.theater.mobile !== undefined) ? `${this.theater.mobile}` : ''
        })
      },
      (reason) => {
        // Handle dismissal or any other reason
        console.log('Modal dismissed with reason:', reason)
      }
    )
  }

  redirectToEditPage (): void {
    void this.router.navigate(['/theater/profile/edit', this.theater._id])
  }

  redirectToTicketsPage (): void {
    void this.router.navigate(['/theater/tickets', this.theaterId])
  }

  logout (): void {
    localStorage.removeItem('theaterAccessToken')
    localStorage.removeItem('theaterRefreshToken')
    this.store.dispatch(deleteTheaterFromStore())
    void this.router.navigate(['/theater/home'])
  }

  openWalletHistory (): void {
    void this.router.navigate(['/theater/profile/wallet-history'])
  }
}
