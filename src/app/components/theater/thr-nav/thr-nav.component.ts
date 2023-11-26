/* eslint-disable @typescript-eslint/semi */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector';

@Component({
  selector: 'app-thr-nav',
  templateUrl: './thr-nav.component.html',
  styleUrls: ['./thr-nav.component.css']
})
export class ThrNavComponent {
  showSidebar = false
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(Store) private readonly store: Store
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
