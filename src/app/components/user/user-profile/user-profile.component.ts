/* eslint-disable @typescript-eslint/semi */
import { Component, type OnDestroy, type OnInit, ChangeDetectionStrategy, inject, effect, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service'
import { Store } from '@ngrx/store';
import { type IUserRes } from 'src/app/models/users';
import { deleteUserFromStore, saveUserOnStore } from 'src/app/states/user/user.actions';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { environments } from 'src/environments/environment';
import { AddToWalletModalComponent } from '../../common/add-to-wallet-modal/add-to-wallet-modal.component';
import { UserService } from 'src/app/services/user.service';
import { RazorpayService } from 'src/app/services/razorpay.service';
import { type Subscription } from 'rxjs';
import { type IRazorpayRes } from 'src/app/models/common';
import { UserNavComponent } from '../user-nav/user-nav.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UserNavComponent, DatePipe]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly userService = inject(UserService);
  private readonly razorpayService = inject(RazorpayService);

  userDetails = this.store.selectSignal(selectUserDetails)
  private readonly paymentResultSubscription: Subscription;
  user!: IUserRes
  profilePic: string = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'
  userId: string = ''
  moneyToAddToWallet = 0

  constructor () {
    this.paymentResultSubscription = this.razorpayService
      .getPaymentResultObservable()
      .subscribe((response: IRazorpayRes | null) => {
        if (response !== null) {
        // Payment was successful, handle accordingly
          console.log('Payment successful from component, confirming ticket');
          this.userService.updateUserWallet(this.userId, this.moneyToAddToWallet).subscribe({
            next: (res) => {
              console.log(res.data.wallet, 'wallet from update wallet')
              this.store.dispatch(saveUserOnStore({ userDetails: res.data }))
              this.user = res.data
            }
          })
        } else {
        // Payment failed, handle accordingly
          console.log('Payment failed');
        }
      });
  }

  ngOnInit (): void {
    effect(() => {
      const user = this.userDetails()
      console.log(user, 'user data from state, user profile')
      if (user !== null) {
        this.user = user
        if (user.profilePic !== undefined) this.profilePic = environments.backendUrl + `/images/${user.profilePic}`
        console.log(this.profilePic)
        this.userId = user._id
      }
    }, { injector: this.injector })
  }

  ngOnDestroy (): void {
    this.paymentResultSubscription.unsubscribe()
  }

  addToWallet (): void {
    const modalRef = this.modalService.open(AddToWalletModalComponent, { static: true })

    void modalRef.result.then(
      (result: { amount: number }) => {
        console.log('submitted form data', result)
        this.moneyToAddToWallet = result.amount
        this.razorpayService.initiateRazorpayPayment(result.amount, {
          name: this.user.name,
          email: this.user.email,
          mobile: (this.user.mobile !== undefined) ? `${this.user.mobile}` : ''
        })
      },
      (reason) => {
        // Handle dismissal or any other reason
        console.log('Modal dismissed with reason:', reason)
      }
    )
  }

  redirectToEditPage (): void {
    console.log('redirecting to edit page');
    void this.router.navigate(['/user/profile/edit', this.user._id])
  }

  openBookings (): void {
    void this.router.navigate(['/user/bookings', this.user._id])
  }

  logout (): void {
    localStorage.removeItem('userAccessToken')
    localStorage.removeItem('userRefreshToken')
    this.store.dispatch(deleteUserFromStore())
    void this.router.navigate(['/user/home'])
  }

  openWalletHistory (): void {
    void this.router.navigate(['/user/profile/wallet-history'])
  }
}
