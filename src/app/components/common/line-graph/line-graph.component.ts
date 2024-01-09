import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChartModule } from 'primeng/chart'
import { type ILineGraphData } from 'src/app/models/charts'

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule
  ],
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent {
  @Input() data: ILineGraphData = {
    labels: [],
    datasets: []
  }

  options: any

  ngOnInit (): void {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#3366ff',
          tension: 0.4
        }
      ]
    }

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    }
  }
}
