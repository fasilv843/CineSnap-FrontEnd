import { Injectable, inject, signal } from '@angular/core'
import { Store } from '@ngrx/store'
import { filter, switchMap } from 'rxjs'
import { type IUserRes } from 'src/app/models/users'
import { AddToWalletModalComponent } from '../components/common/add-to-wallet-modal/add-to-wallet-modal.component'
import { saveUserOnStore } from '../states/user/user.actions'
import { ModalService } from './modal.service'
import { RazorpayService } from './razorpay.service'
import { UserService } from './user.service'

/**
 * "Add money" for the signed-in user: amount dialog → Razorpay checkout → credit the wallet → refresh the store.
 * One app-wide listener for payment results, so a dismissed checkout can never be credited twice later.
 */
@Injectable({ providedIn: 'root' })
export class WalletTopUpService {
  private readonly modalService = inject(ModalService)
  private readonly razorpayService = inject(RazorpayService)
  private readonly userService = inject(UserService)
  private readonly store = inject(Store)

  // The top-up waiting for Razorpay to confirm; replaced if the user starts another one
  private readonly pending = signal<{ userId: string, amount: number } | null>(null)

  constructor () {
    this.razorpayService.getPaymentResultObservable().pipe(
      filter(response => response !== null && this.pending() !== null),
      switchMap(() => {
        const { userId, amount } = this.pending() as { userId: string, amount: number }
        this.pending.set(null)
        return this.userService.updateUserWallet(userId, amount)
      })
    ).subscribe(res => { this.store.dispatch(saveUserOnStore({ userDetails: res.data })) })
  }

  addMoney (user: IUserRes): void {
    this.modalService.open(AddToWalletModalComponent, { static: true }).result.then(
      ({ amount }: { amount: string }) => {
        this.pending.set({ userId: user._id, amount: Number(amount) })
        this.razorpayService.initiateRazorpayPayment(Number(amount), {
          name: user.name,
          email: user.email,
          mobile: user.mobile !== undefined ? `${user.mobile}` : ''
        })
      },
      () => {} // dialog dismissed
    )
  }
}
