import { Injectable, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { type Observable, tap } from 'rxjs'
import { type ITheaterRes } from 'src/app/models/theater'
import { type IUserRes } from 'src/app/models/users'
import { AddToWalletModalComponent } from '../components/common/add-to-wallet-modal/add-to-wallet-modal.component'
import { ToastService } from '../shared/ui/toast.service'
import { saveTheaterOnStore } from '../states/theater/theater.action'
import { saveUserOnStore } from '../states/user/user.actions'
import { ModalService } from './modal.service'
import { type IPayer, RazorpayService } from './razorpay.service'
import { TheaterService } from './theater.service'
import { UserService } from './user.service'

/** "Add money": amount dialog → Razorpay checkout → credit the wallet → refresh the store. */
@Injectable({ providedIn: 'root' })
export class WalletTopUpService {
  private readonly modalService = inject(ModalService)
  private readonly razorpayService = inject(RazorpayService)
  private readonly userService = inject(UserService)
  private readonly theaterService = inject(TheaterService)
  private readonly store = inject(Store)
  private readonly toast = inject(ToastService)

  addMoney (user: IUserRes): void {
    this.topUp(toPayer(user), amount => this.userService.updateUserWallet(user._id, amount).pipe(
      tap(res => { this.store.dispatch(saveUserOnStore({ userDetails: res.data })) })
    ))
  }

  addTheaterMoney (theater: ITheaterRes): void {
    this.topUp(toPayer(theater), amount => this.theaterService.updateTheaterWallet(theater._id, amount).pipe(
      tap(res => { if (res.data !== null) this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data })) })
    ))
  }

  private topUp (payer: IPayer, credit: (amount: number) => Observable<unknown>): void {
    this.modalService.open(AddToWalletModalComponent, { static: true }).result.then(
      async ({ amount }: { amount: string }) => {
        const value = Number(amount)
        const payment = await this.razorpayService.pay(value, payer, 'Add money to CineSnap wallet')
        if (payment === null) return // checkout closed without paying
        credit(value).subscribe(() => { this.toast.success(`₹${value} added to your wallet`) })
      },
      () => {} // dialog dismissed
    )
  }
}

function toPayer (account: { name: string, email: string, mobile?: number }): IPayer {
  return { name: account.name, email: account.email, mobile: account.mobile !== undefined && account.mobile !== 0 ? `${account.mobile}` : '' }
}
