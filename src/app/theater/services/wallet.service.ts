import { Injectable, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { tap } from 'rxjs'
import { type ITheaterRes } from 'src/app/core/models/theater.model'
import { saveTheaterOnStore } from 'src/app/core/state/theater/theater.action'
import { WalletTopUpService } from 'src/app/shared/services/wallet-top-up.service'
import { TheaterAccountRepo } from '../repos/account.repo'

@Injectable({ providedIn: 'root' })
export class TheaterWalletService {
  private readonly walletTopUp = inject(WalletTopUpService)
  private readonly accountRepo = inject(TheaterAccountRepo)
  private readonly store = inject(Store)

  addMoney (theater: ITheaterRes): void {
    this.walletTopUp.topUp(theater, amount => this.accountRepo.updateTheaterWallet(theater._id, amount).pipe(
      tap(res => { if (res.data !== null) this.store.dispatch(saveTheaterOnStore({ theaterDetails: res.data })) })
    ))
  }
}
