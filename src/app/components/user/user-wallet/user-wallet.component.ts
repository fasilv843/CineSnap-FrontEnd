/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { IWalletHistory } from 'src/app/models/common'
import { UserService } from 'src/app/services/user.service'
import { selectUserDetails } from 'src/app/states/user/user.selector'
import { UserNavComponent } from '../user-nav/user-nav.component';
import { WalletHistoryComponent } from '../../common/wallet-history/wallet-history.component';

@Component({
    selector: 'app-user-wallet',
    templateUrl: './user-wallet.component.html',
    styleUrls: ['./user-wallet.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UserNavComponent, WalletHistoryComponent]
})
export class UserWalletComponent implements OnInit {
  private readonly store = inject(Store)
  private readonly userService = inject(UserService)

  userData = this.store.selectSignal(selectUserDetails)
  userId = ''
  walletHistory: IWalletHistory[] = []
  count = 0

  page = 1
  itemsPerPage = 10

  ngOnInit (): void {
    const user = this.userData()
    if (user !== null) this.userId = user._id

    this.getWalletHistory()
  }

  getWalletHistory (): void {
    this.userService.getUserWalletHistory(this.userId, this.page, this.itemsPerPage).subscribe({
      next: (res) => {
        console.log(res.data, 'res.data from wallet history')
        if (res.data === null) return
        this.walletHistory = res.data.walletHistory
        this.count = res.data.count
      }
    })
  }

  onPageChange (page: number): void {
    this.page = page
    this.getWalletHistory()
  }

  onItemsPerPageChange (itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage
    this.page = 1
    this.getWalletHistory()
  }
}
