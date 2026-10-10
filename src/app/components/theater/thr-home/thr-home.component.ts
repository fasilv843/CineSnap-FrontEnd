/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { getRandomColor } from 'src/app/helpers/generateColors'
import { type ILineGraphData } from 'src/app/models/charts'
import { TheaterService } from 'src/app/services/theater.service'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { ThrNavComponent } from '../thr-nav/thr-nav.component';
import { LineGraphComponent } from '../../common/line-graph/line-graph.component';

@Component({
    selector: 'app-thr-home',
    templateUrl: './thr-home.component.html',
    styleUrls: ['./thr-home.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ThrNavComponent, LineGraphComponent]
})
export class ThrHomeComponent implements OnInit {
  theaterData$ = this.store.pipe(select(selectTheaterDetails))
  data!: ILineGraphData
  theaterId = ''

  constructor (
    private readonly theaterService: TheaterService,
    private readonly store: Store
  ) {}

  ngOnInit (): void {
    this.theaterData$.subscribe(theater => {
      if (theater !== null) this.theaterId = theater._id
    })
    this.theaterService.getRevenueData(this.theaterId).subscribe({
      next: (res) => {
        console.log(res.data, 'res from get revenue')
        if (res.data === null) return
        this.data = {
          labels: res.data.labels,
          datasets: [
            {
              label: 'Revenue Graph',
              data: res.data.data,
              fill: false,
              borderColor: getRandomColor(),
              tension: 0.4
            }
          ]
        }
      }
    })
  }
}
