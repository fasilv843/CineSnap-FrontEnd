/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectUserDetails } from 'src/app/states/user/user.selector';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  isLoggedIn: boolean = false
  showSidebar = false
  userDetails$ = this.store.pipe(select(selectUserDetails))

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.userDetails$.subscribe((userDetails) => {
      if (userDetails !== null) {
        // userDetails is defined, do something with it
        console.log('User Details:', userDetails);
      } else {
        // userDetails is undefined, handle the case where the user is not logged in
        console.log('User is not logged in');
      }
    });
  }

  toggleSideBar (): void {
    this.showSidebar = !this.showSidebar
  }

  onLogout (): void {
    localStorage.removeItem('userToken')
    void this.router.navigate(['/user/home'])
    this.toggleSideBar()
  }
}
