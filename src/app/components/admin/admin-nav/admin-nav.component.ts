/* eslint-disable @typescript-eslint/semi */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent {
  showSidebar = false

  constructor (
    @Inject(Router) private readonly router: Router
  ) {}

  toggleSideBar (): void {
    this.showSidebar = !this.showSidebar
  }

  onLogout (): void {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    void this.router.navigate(['/admin/login'])
    this.toggleSideBar()
  }
}
