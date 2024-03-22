/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { imagesFolderPath } from 'src/app/shared/constants';
import { saveCoords } from 'src/app/states/coords/coords.actions';
import { selectCoords } from 'src/app/states/coords/coords.selector';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { UserOffcanvasComponent } from './user-offcanvas/user-offcanvas.component';
import { deleteUserFromStore } from 'src/app/states/user/user.actions';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  isLoggedIn: boolean = false
  userDetails$ = this.store.pipe(select(selectUserDetails))
  coords$ = this.store.pipe(select(selectCoords))
  latitude: number | undefined;
  longitude: number | undefined;
  imageFolderPath = imagesFolderPath

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(Store) private readonly store: Store,
    @Inject(NgbOffcanvas) private readonly ngbOffcanvas: NgbOffcanvas
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

    this.userDetails$.subscribe(user => {
      if (user !== null) this.isLoggedIn = true
    })
  }

  openOffcanvas (): void {
    this.ngbOffcanvas.open(UserOffcanvasComponent, { backdrop: true }).result.then(
      (result) => {
        console.log(result, 'result of canvas')
        if (result === 'logout') {
          console.log(result, this.isLoggedIn);
          if (this.isLoggedIn) this.onLogout()
          else void this.router.navigate(['/user/login'])
        } else {
          void this.router.navigate([`/user/${result}`])
        }
      },
      (closeReason) => {
        console.log('off canvas closed with reason : ' + closeReason)
      }
    )
  }

  onLogout (): void {
    localStorage.removeItem('userAccessToken')
    localStorage.removeItem('userRefreshToken')
    this.store.dispatch(deleteUserFromStore())
    void this.router.navigate(['/user/home'])
    this.isLoggedIn = false
  }
}
