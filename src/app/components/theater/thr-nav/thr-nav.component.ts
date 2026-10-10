/* eslint-disable @typescript-eslint/semi */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { imagesFolderPath } from 'src/app/shared/constants';
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector';
import { ThrOffcanvasComponent } from './thr-offcanvas/thr-offcanvas.component';
import { ModalService } from 'src/app/services/modal.service'
import { deleteTheaterFromStore } from 'src/app/states/theater/theater.action';

@Component({
    selector: 'app-thr-nav',
    templateUrl: './thr-nav.component.html',
    styleUrls: ['./thr-nav.component.css'],
    standalone: false
})
export class ThrNavComponent {
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  imageFolderPath = imagesFolderPath

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(Store) private readonly store: Store,
    @Inject(ModalService) private readonly modalService: ModalService
  ) {}

  openOffcanvas (): void {
    this.modalService.open(ThrOffcanvasComponent, { variant: 'offcanvas' }).result.then(
      (result) => {
        console.log(result, 'result of canvas')
        if (result === 'logout') {
          this.onLogout()
        } else {
          void this.router.navigate([`/theater/${result}`])
        }
      },
      (closeReason) => {
        console.log('off canvas closed with reason : ' + closeReason)
      }
    )
  }

  onLogout (): void {
    localStorage.removeItem('theaterAccessToken')
    localStorage.removeItem('theaterRefreshToken')
    this.store.dispatch(deleteTheaterFromStore())
    void this.router.navigate(['/theater/login'])
  }
}
