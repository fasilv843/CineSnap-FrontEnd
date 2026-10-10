/* eslint-disable @typescript-eslint/semi */
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { imagesFolderPath } from 'src/app/shared/constants';
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector';
import { ThrOffcanvasComponent } from './thr-offcanvas/thr-offcanvas.component';
import { ModalService } from 'src/app/services/modal.service'
import { deleteTheaterFromStore } from 'src/app/states/theater/theater.action';
import { UpperCasePipe, SlicePipe } from '@angular/common';

@Component({
    selector: 'app-thr-nav',
    templateUrl: './thr-nav.component.html',
    styleUrls: ['./thr-nav.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, UpperCasePipe, SlicePipe]
})
export class ThrNavComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly modalService = inject(ModalService);

  theaterDetails = this.store.selectSignal(selectTheaterDetails)
  imageFolderPath = imagesFolderPath

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
