/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { imagesFolderPath } from 'src/app/shared/constants';
import { saveCoords } from 'src/app/states/coords/coords.actions';
import { selectCoords } from 'src/app/states/coords/coords.selector';
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
  coords$ = this.store.pipe(select(selectCoords))
  latitude: number | undefined;
  longitude: number | undefined;
  imageFolderPath = imagesFolderPath

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(Store) private readonly store: Store
  ) {}

  ngOnInit (): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords, 'position.coords');
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.store.dispatch(saveCoords({ coords: { coordinates: [this.longitude, this.latitude] } }))
      });
    } else {
      console.log('No support for geolocation')
    }
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
