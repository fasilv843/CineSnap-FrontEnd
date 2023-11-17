/* eslint-disable @typescript-eslint/semi */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thr-nav',
  templateUrl: './thr-nav.component.html',
  styleUrls: ['./thr-nav.component.css']
})
export class ThrNavComponent {
  showSidebar = false

  constructor (
    @Inject(Router) private readonly router: Router
  ) {}

  toggleSideBar (): void {
    this.showSidebar = !this.showSidebar
  }

  onLogout (): void {
    localStorage.removeItem('theaterToken')
    void this.router.navigate(['/theater/login'])
    this.toggleSideBar()
  }
}
