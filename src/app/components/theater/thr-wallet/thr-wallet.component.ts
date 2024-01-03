/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { IWalletHistory } from 'src/app/models/common'
import { TheaterService } from 'src/app/services/theater.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  selector: 'app-thr-wallet',
  templateUrl: './thr-wallet.component.html',
  styleUrls: ['./thr-wallet.component.css']
})
export class ThrWalletComponent {
  theaterData$ = this.store.pipe(select(selectTheaterDetails))
  theaterId = ''

  walletHistory: IWalletHistory[] = []
  count = 0

  page = 1
  itemsPerPage = 10

  constructor (
    private readonly store: Store,
    private readonly theaterService: TheaterService
  ) {}

  ngOnInit (): void {
    this.theaterData$.subscribe(theater => {
      if (theater === null) return
      this.theaterId = theater._id
    })

    this.getWalletHistory()
  }

  getWalletHistory (): void {
    this.theaterService.getTheaterWalletHistory(this.theaterId, this.page, this.itemsPerPage).subscribe({
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
