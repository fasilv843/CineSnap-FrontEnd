import { type AfterViewInit, Component, type ElementRef, Input, type OnChanges, type OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core'

import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions
} from 'chart.js'
import { type ILineGraphData } from 'src/app/models/charts'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler)

const textColor = '#374151' // gray-700
const textColorSecondary = '#6b7280' // gray-500
const surfaceBorder = '#e5e7eb' // gray-200

@Component({
    selector: 'app-line-graph',
    imports: [],
    templateUrl: './line-graph.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: ILineGraphData = {
    labels: [],
    datasets: []
  }

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>

  private chart?: Chart<'line'>

  options: ChartOptions<'line'> = {
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
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  }

  ngAfterViewInit (): void {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: this.chartData(),
      options: this.options
    })
  }

  ngOnChanges (): void {
    if (this.chart === undefined) return
    this.chart.data = this.chartData()
    this.chart.update()
  }

  ngOnDestroy (): void {
    this.chart?.destroy()
  }

  private chartData (): ILineGraphData {
    // parents pass undefined until their revenue request resolves
    return this.data ?? { labels: [], datasets: [] }
  }
}
