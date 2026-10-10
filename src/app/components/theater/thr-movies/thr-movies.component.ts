/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy } from '@angular/core'
import { DataServiceService } from 'src/app/services/data-service.service'
import { ThrNavComponent } from '../thr-nav/thr-nav.component';
import { CsMoviesComponent } from '../../common/cs-movies/cs-movies.component';

@Component({
    selector: 'app-thr-movies',
    templateUrl: './thr-movies.component.html',
    styleUrls: ['./thr-movies.component.css'],
    providers: [DataServiceService],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThrNavComponent, CsMoviesComponent]
})
export class ThrMoviesComponent {}
