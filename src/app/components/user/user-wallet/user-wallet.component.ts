/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { IWalletHistory } from 'src/app/models/common'
import { UserService } from 'src/app/services/user.service'
import { selectUserDetails } from 'src/app/states/user/user.selector'

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.css']
})
export class UserWalletComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUserDetails))
  userId = ''
  walletHistory: IWalletHistory[] = []
  count = 0

  page = 1
  itemsPerPage = 10

  constructor (
    private readonly store: Store,
    private readonly userService: UserService
  ) {}

  ngOnInit (): void {
    this.userData$.subscribe(user => {
      if (user === null) return
      this.userId = user._id
    })

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
