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

@Component({
  selector: 'app-user-theaters',
  templateUrl: './user-theaters.component.html',
  styleUrls: ['./user-theaters.component.css']
})
export class UserTheatersComponent implements OnInit, OnDestroy {
  coords$ = this.store.pipe(select(selectCoords))
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
    this.coords$.pipe(takeUntil(this.unsubscribe$)).subscribe((coords) => {
      if (coords !== null) {
        const lon = coords.coordinates[0]
        const lat = coords.coordinates[1]
        this.theaterService.getNearestTheaters(lon, lat).subscribe({
          next: (res) => {
            console.log(res, 'nearest theater response');
            this.theaters = res.data
          }
        })
      } else {
        console.log('coords not available now')
      }
    })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
