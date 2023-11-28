/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { type IUserRes } from 'src/app/models/users';
// import { type Observable } from 'rxjs';
// import { type IUser } from 'src/app/models/users';
import { selectUserDetails } from 'src/app/states/user/user.selector';

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
  profilePic!: string
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
      this.user = user ?? this.user
      this.name = user?.name ?? '';
      this.email = user?.email ?? '';
      this.dob = user?.dob ?? new Date('1990-01-01');
      this.mobile = user?.mobile ?? 0
      this.profilePic = user?.profilePic ?? ''
      this.city = user?.address?.city ?? ''
      this.state = user?.address?.state ?? ''
      this.district = user?.address?.district ?? ''
      this.country = user?.address?.country ?? ''
      this.zip = user?.address?.zip ?? 0
      this.wallet = user?.wallet ?? 0
      this.userId = user?._id ?? ''
    })
  }

  redirectToEditPage (): void {
    console.log('redirecting to edit page');
    void this.router.navigate(['/user/profile/edit', this.user._id])
  }

  openEditProfile (): void {
    this.editMode = !this.editMode
  }

  closeEditProfile (): void {
    this.editMode = !this.editMode
  }
}
