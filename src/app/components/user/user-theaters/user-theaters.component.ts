/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, type OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { type ITheater } from 'src/app/models/theater';
import { TheaterService } from 'src/app/services/theater.service';
import { saveCoords } from 'src/app/states/coords/coords.actions';
import { selectCoords } from 'src/app/states/coords/coords.selector';

@Component({
  selector: 'app-user-theaters',
  templateUrl: './user-theaters.component.html',
  styleUrls: ['./user-theaters.component.css']
})
export class UserTheatersComponent implements OnInit {
  coords$ = this.store.pipe(select(selectCoords))
  theaters: ITheater[] = []

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
    this.coords$.subscribe((coords) => {
      if (coords !== null) {
        const lon = coords.coordinates[0]
        const lat = coords.coordinates[1]
        this.theaterService.getNearestTheaters(lon, lat).subscribe({
          next: (res: any) => {
            console.log(res, 'nearest theater response');
            this.theaters = res.data
          }
        })
      } else {
        console.log('coords not available now')
      }
    })
  }
}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
// import { Store, select } from '@ngrx/store';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { saveCoords } from 'path-to-your-actions';
// import { selectCoords } from 'path-to-your-selectors';

// @Component({
//   selector: 'app-user-theaters',
//   templateUrl: './user-theaters.component.html',
//   styleUrls: ['./user-theaters.component.css'],
// })
// export class UserTheatersComponent implements OnInit, OnDestroy {
//   coords$ = this.store.pipe(select(selectCoords));
//   latitude: number | undefined;
//   longitude: number | undefined;
//   private unsubscribe$ = new Subject<void>();

//   constructor(
//     private readonly router: Router,
//     private readonly store: Store
//   ) {}

//   ngOnInit(): void {
//     this.coords$
//       .pipe(takeUntil(this.unsubscribe$))
//       .subscribe((coords) => {
//         if (coords !== null) console.log(coords);
//         else console.log('coords not available now');
//       });
//   }

//   ngOnDestroy(): void {
//     this.unsubscribe$.next();
//     this.unsubscribe$.complete();
//   }

//   private getCurrentPosition(): void {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         console.log(position.coords, 'position.coords');
//         this.latitude = position.coords.latitude;
//         this.longitude = position.coords.longitude;
//         this.store.dispatch(saveCoords({ coords: { coordinates: [this.longitude, this.latitude] } }));
//       });
//     } else {
//       console.log('No support for geolocation');
//     }
//   }
// }
