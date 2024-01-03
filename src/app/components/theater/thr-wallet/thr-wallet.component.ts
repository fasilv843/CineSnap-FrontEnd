/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
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

  constructor (
    private readonly store: Store,
    private readonly theaterService: TheaterService
  ) {}

  ngOnInit (): void {
    this.theaterData$.subscribe(theater => {
      if (theater === null) return
      this.theaterId = theater._id
    })

    this.theaterService.getTheaterWalletHistory(this.theaterId).subscribe({
      next: (res) => {
        console.log(res.data, 'res.data from wallet history')
      }
    })
  }
}
