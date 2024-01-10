/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
import { getRandomColor } from 'src/app/helpers/generateColors';
import { ILineGraphData } from 'src/app/models/charts';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  data!: ILineGraphData

  constructor (
    private readonly adminService: AdminService
  ) {}

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
