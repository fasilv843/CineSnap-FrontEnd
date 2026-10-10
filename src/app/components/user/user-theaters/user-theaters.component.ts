/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, type OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITheaterRes } from 'src/app/models/theater';
import { TheaterService } from 'src/app/services/theater.service';
import { imagesFolderPath } from 'src/app/shared/constants';
import { saveCoords } from 'src/app/states/coords/coords.actions';
import { selectCoords } from 'src/app/states/coords/coords.selector';
import { selectUserDetails } from 'src/app/states/user/user.selector';
import { UserNavComponent } from '../user-nav/user-nav.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-user-theaters',
    templateUrl: './user-theaters.component.html',
    styleUrls: ['./user-theaters.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UserNavComponent, RouterLink]
})
export class UserTheatersComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly theaterService = inject(TheaterService);

  coords = this.store.selectSignal(selectCoords)
  userData = this.store.selectSignal(selectUserDetails)
  theaters: ITheaterRes[] = []
  folderPath = imagesFolderPath

  constructor () {
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
    const coords = this.coords()
    if (coords !== null) {
      console.log('coords from ngOnInit', coords);
      lon = coords.coordinates[0]
      lat = coords.coordinates[1]
    } else {
      console.log('curr coords not available')
    }

    const user = this.userData()
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/strict-boolean-expressions
    if (user && user.coords && user.coords.coordinates[0] && user.coords.coordinates[1]) {
      console.log(user.coords, 'user.coords from ngOnInit');
      lon = user.coords.coordinates[0]
      lat = user.coords.coordinates[1]
    }

    this.theaterService.getNearestTheaters(lon, lat).subscribe({
      next: (res) => {
        console.log(res, 'nearest theater response');
        this.theaters = res.data
      }
    })
  }
}
