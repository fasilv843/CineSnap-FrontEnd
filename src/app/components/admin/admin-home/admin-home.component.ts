/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core'
import { getRandomColor } from 'src/app/helpers/generateColors';
import { ILineGraphData } from 'src/app/models/charts';
import { AdminService } from 'src/app/services/admin.service';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { LineGraphComponent } from '../../common/line-graph/line-graph.component';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AdminNavComponent, LineGraphComponent]
})
export class AdminHomeComponent implements OnInit {
  private readonly adminService = inject(AdminService)

  data!: ILineGraphData

  ngOnInit (): void {
    this.adminService.getRevenueData().subscribe({
      next: (res) => {
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
