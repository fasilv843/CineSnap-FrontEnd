/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
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

  constructor (
    private readonly store: Store,
    private readonly userService: UserService
  ) {}

  ngOnInit (): void {
    this.userData$.subscribe(user => {
      if (user === null) return
      this.userId = user._id
    })

    this.userService.getUserWalletHistory(this.userId).subscribe({
      next: (res) => {
        console.log(res.data, 'res.data from wallet history')
      }
    })
  }
}
