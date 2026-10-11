import { Injectable, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { tap } from 'rxjs'
import { type IUserRes } from 'src/app/core/models/user.model'
import { saveUserOnStore } from 'src/app/core/state/user/user.actions'
import { WalletTopUpService } from 'src/app/shared/services/wallet-top-up.service'
import { UserAccountRepo } from '../repos/account.repo'

@Injectable({ providedIn: 'root' })
export class UserWalletService {
  private readonly walletTopUp = inject(WalletTopUpService)
  private readonly accountRepo = inject(UserAccountRepo)
  private readonly store = inject(Store)

  addMoney (user: IUserRes): void {
    this.walletTopUp.topUp(user, amount => this.accountRepo.updateUserWallet(user._id, amount).pipe(
      tap(res => { this.store.dispatch(saveUserOnStore({ userDetails: res.data })) })
    ))
  }
}
