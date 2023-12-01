import { Component, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { type ITheaterRes } from 'src/app/models/theater'
import { deleteTheaterFromStore } from 'src/app/states/theater/theater.action'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  selector: 'app-thr-profile',
  templateUrl: './thr-profile.component.html',
  styleUrls: ['./thr-profile.component.css']
})
export class ThrProfileComponent {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  theater!: ITheaterRes

  constructor (
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router
  ) {}

  ngOnInit (): void {
    this.theaterDetails$.subscribe((theater) => {
      if (theater !== null) {
        this.theater = theater
      }
    })
  }

  redirectToEditPage (): void {
    void this.router.navigate(['/theater/profile/edit', this.theater._id])
  }

  logout (): void {
    console.log('loggin out from theater')
    localStorage.removeItem('theaterToken')
    this.store.dispatch(deleteTheaterFromStore())
    void this.router.navigate(['/theater/home'])
  }
}
