import { Component, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { type ITheaterRes } from 'src/app/models/theater'
import { deleteTheaterFromStore } from 'src/app/states/theater/theater.action'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { environments } from 'src/environments/environment'

@Component({
  selector: 'app-thr-profile',
  templateUrl: './thr-profile.component.html',
  styleUrls: ['./thr-profile.component.css']
})
export class ThrProfileComponent {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  theater!: ITheaterRes
  profilePic: string = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'

  constructor (
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router
  ) {}

  ngOnInit (): void {
    this.theaterDetails$.subscribe((theater) => {
      if (theater !== null) {
        this.theater = theater
        if (theater.profilePic !== undefined) this.profilePic = environments.backendUrl + `/images/${theater.profilePic}`
      }
    })
  }

  redirectToEditPage (): void {
    void this.router.navigate(['/theater/profile/edit', this.theater._id])
  }

  logout (): void {
    console.log('loggin out from theater')
    localStorage.removeItem('theaterAccessToken')
    localStorage.removeItem('theaterRefreshToken')
    this.store.dispatch(deleteTheaterFromStore())
    void this.router.navigate(['/theater/home'])
  }
}
