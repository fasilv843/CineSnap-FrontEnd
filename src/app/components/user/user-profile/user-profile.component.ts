/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, type OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { type Observable } from 'rxjs';
import { type IUser } from 'src/app/models/users';
import { selectUserDetails } from 'src/app/states/user/user.selector';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails$ = this.store.pipe(select(selectUserDetails))

  constructor (
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.userDetails$.subscribe({

    })
  }
}
