/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, OnDestroy, type OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ITheaterRes } from 'src/app/models/theater';
import { TheaterService } from 'src/app/services/theater.service';
import { imagesFolderPath } from 'src/app/shared/constants';
import { saveCoords } from 'src/app/states/coords/coords.actions';
import { selectCoords } from 'src/app/states/coords/coords.selector';
import { selectUserDetails } from 'src/app/states/user/user.selector';

@Component({
  selector: 'app-user-theaters',
  templateUrl: './user-theaters.component.html',
  styleUrls: ['./user-theaters.component.css']
})
export class UserTheatersComponent implements OnInit, OnDestroy {
  coords$ = this.store.pipe(select(selectCoords))
  userData$ = this.store.pipe(select(selectUserDetails))
  theaters: ITheaterRes[] = []
  folderPath = imagesFolderPath
  unsubscribe$ = new Subject<void>()

  constructor (
    @Inject(Store) private readonly store: Store,
    private readonly theaterService: TheaterService
  ) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;
        this.store.dispatch(saveCoords({ coords: { coordinates: [lon, lat] } }))
      });
    } else {
      console.log('No support for geolocation')
    }
  }

  ngOnInit (): void {
    // Longitude and Latitude of Ramanattukara as default
    let lon = 75.869032
    let lat = 11.178324
    this.coords$.pipe(takeUntil(this.unsubscribe$)).subscribe((coords) => {
      if (coords !== null) {
        console.log('coords from ngOnInit', coords);
        lon = coords.coordinates[0]
        lat = coords.coordinates[1]
      } else {
        console.log('curr coords not available')
      }
    })

    this.userData$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/strict-boolean-expressions
      if (user && user.coords && user.coords.coordinates[0] && user.coords.coordinates[1]) {
        console.log(user.coords, 'user.coords from ngOnInit');
        lon = user.coords.coordinates[0]
        lat = user.coords.coordinates[1]
      }
    })

    this.theaterService.getNearestTheaters(lon, lat).subscribe({
      next: (res) => {
        console.log(res, 'nearest theater response');
        this.theaters = res.data
      }
    })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
