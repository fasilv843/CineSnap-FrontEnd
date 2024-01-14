/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { DataServiceService } from 'src/app/services/data-service.service'

@Component({
  selector: 'app-thr-movies',
  templateUrl: './thr-movies.component.html',
  styleUrls: ['./thr-movies.component.css'],
  providers: [DataServiceService]
})
export class ThrMoviesComponent {}
