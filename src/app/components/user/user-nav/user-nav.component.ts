/* eslint-disable @typescript-eslint/semi */
import { Component, type OnInit, ChangeDetectionStrategy, inject, effect, Injector } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service'
import { Store } from '@ngrx/store';
import { imagesFolderPath } from 'src/app/shared/constants';
import { saveCoords } from 'src/app/states/coords/coords.actions';
import { selectCoords } from 'src/app/states/coords/coords.selector';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { UserOffcanvasComponent } from './user-offcanvas/user-offcanvas.component';
import { deleteUserFromStore } from 'src/app/states/user/user.actions';
import { UpperCasePipe, SlicePipe } from '@angular/common';

@Component({
    selector: 'app-user-nav',
    templateUrl: './user-nav.component.html',
    styleUrls: ['./user-nav.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, UpperCasePipe, SlicePipe]
})
export class UserNavComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly store = inject(Store);
  private readonly modalService = inject(ModalService);

  isLoggedIn: boolean = false
  userDetails = this.store.selectSignal(selectUserDetails)
  coords = this.store.selectSignal(selectCoords)
  latitude: number | undefined;
  longitude: number | undefined;
  imageFolderPath = imagesFolderPath

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

    effect(() => {
      const user = this.userDetails()
      if (user !== null) this.isLoggedIn = true
    }, { injector: this.injector })
  }

  openOffcanvas (): void {
    this.modalService.open(UserOffcanvasComponent, { variant: 'offcanvas' }).result.then(
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
