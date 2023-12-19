/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { type IUserRes } from 'src/app/models/users';
import { deleteUserFromStore } from 'src/app/states/user/user.actions';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { environments } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails$ = this.store.pipe(select(selectUserDetails))
  user!: IUserRes
  name: string = ''
  email: string = ''
  dob!: Date
  mobile!: number
  profilePic: string = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'
  city!: string
  state!: string
  district!: string
  country!: string
  zip!: number
  wallet!: number
  editMode: boolean = false
  userId: string = ''

  constructor (
    @Inject(Store) private readonly store: Store,
    @Inject(Router) private readonly router: Router
  ) {}

  ngOnInit (): void {
    this.userDetails$.subscribe((user) => {
      console.log(user, 'user data from state, user profile')
      if (user !== null) {
        this.user = user
        this.name = user.name
        this.email = user.email
        this.dob = user.dob
        this.mobile = user.mobile ?? 0
        if (user.profilePic !== undefined) this.profilePic = environments.backendUrl + `/images/${user.profilePic}`
        console.log(this.profilePic)
        if (user.address !== undefined) {
          this.city = user.address.city
          this.state = user.address.state
          this.district = user.address.district
          this.country = user.address.country
          this.zip = user.address.zip
        }
        this.wallet = user.wallet
        this.userId = user._id
      }
    })
  }

  redirectToEditPage (): void {
    console.log('redirecting to edit page');
    void this.router.navigate(['/user/profile/edit', this.user._id])
  }

  openBookings (): void {
    void this.router.navigate(['/user/bookings', this.user._id])
  }

  logout (): void {
    localStorage.removeItem('userAccessToken')
    localStorage.removeItem('userRefreshToken')
    this.store.dispatch(deleteUserFromStore())
    void this.router.navigate(['/user/home'])
  }
}
