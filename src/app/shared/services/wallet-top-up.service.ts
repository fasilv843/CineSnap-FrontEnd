import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { AddToWalletModalComponent } from '../components/add-to-wallet-modal/add-to-wallet-modal.component'
import { ToastService } from '../../core/toast/toast.service'
import { ModalService } from '../ui/modal.service'
import { type IPayer, RazorpayService } from './razorpay.service'

interface WalletOwner { name: string, email: string, mobile?: number }

/**
 * "Add money": amount dialog → Razorpay checkout → credit. Each section passes how to credit its own wallet
 * (see UserWalletService, TheaterWalletService).
 */
@Injectable({ providedIn: 'root' })
export class WalletTopUpService {
  private readonly modalService = inject(ModalService)
  private readonly razorpayService = inject(RazorpayService)
  private readonly toast = inject(ToastService)

  topUp (owner: WalletOwner, credit: (amount: number) => Observable<unknown>): void {
    this.modalService.open(AddToWalletModalComponent, { static: true }).result.then(
      async ({ amount }: { amount: string }) => {
        const value = Number(amount)
        const payment = await this.razorpayService.pay(value, toPayer(owner), 'Add money to CineSnap wallet')
        if (payment === null) return // checkout closed without paying
        credit(value).subscribe(() => { this.toast.success(`₹${value} added to your wallet`) })
      },
      () => {} // dialog dismissed
    )
  }
}

function toPayer (account: WalletOwner): IPayer {
  return { name: account.name, email: account.email, mobile: account.mobile !== undefined && account.mobile !== 0 ? `${account.mobile}` : '' }
}
