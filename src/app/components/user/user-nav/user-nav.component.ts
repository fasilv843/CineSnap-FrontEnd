/* eslint-disable @typescript-eslint/semi */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent {
  isLoggedIn: boolean = false
  burgerClicked = false

  constructor (
    @Inject(Router) private readonly router: Router
  ) {}

  toggleSideBar (): void {
    this.burgerClicked = !this.burgerClicked
  }

  onLogout (): void {
    localStorage.removeItem('userToken')
    void this.router.navigate(['/user/home'])
    this.toggleSideBar()
  }
}
