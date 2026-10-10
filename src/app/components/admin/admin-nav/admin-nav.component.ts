/* eslint-disable @typescript-eslint/semi */
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-nav',
    templateUrl: './admin-nav.component.html',
    styleUrls: ['./admin-nav.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink]
})
export class AdminNavComponent {
  private readonly router = inject(Router);

  showSidebar = false

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
