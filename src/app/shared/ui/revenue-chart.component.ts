import { ChangeDetectionStrategy, Component, DestroyRef, type ElementRef, effect, inject, input, viewChild } from '@angular/core'
import { CategoryScale, Chart, Filler, LineController, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js'
import { type IRevenueData } from 'src/app/models/charts'
import { ThemeService } from 'src/app/services/theme.service'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

/** Reads a theme token from <html>, so the chart follows the light/dark theme like the rest of the page. */
function token (name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Canvas fills need a plain color; tokens are #rrggbb */
function withAlpha (hex: string, alpha: number): string {
  const value = parseInt(hex.replace('#', ''), 16)
  if (Number.isNaN(value)) return 'transparent'
  return `rgb(${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255} / ${alpha})`
}

/**
 * Revenue over time as a single line (the card title names the series, so there is no legend).
 * A visually hidden table carries the same numbers for screen readers.
 */
@Component({
  selector: 'cs-revenue-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative h-72 sm:h-80">
      <canvas #canvas role="img" [attr.aria-label]="label()"></canvas>
    </div>
    <table class="sr-only">
      <caption>{{ label() }}</caption>
      <thead><tr><th scope="col">Period</th><th scope="col">Revenue</th></tr></thead>
      <tbody>
        @for (period of revenue().labels; track $index) {
          <tr><td>{{ period }}</td><td>{{ format(revenue().data[$index]) }}</td></tr>
        }
      </tbody>
    </table>
  `
})
export class RevenueChartComponent {
  readonly revenue = input.required<IRevenueData>()
  readonly label = input('Revenue')

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas')
  private readonly theme = inject(ThemeService).theme
  private chart?: Chart<'line'>

  constructor () {
    effect(() => {
      const { labels, data } = this.revenue()
      this.theme() // rebuild with the new token values when the theme changes
      this.chart?.destroy()
      this.chart = this.build(this.canvas().nativeElement, labels, data)
    })
    inject(DestroyRef).onDestroy(() => this.chart?.destroy())
  }

  protected format (value: number | undefined): string {
    return rupees.format(value ?? 0)
  }

  private build (canvas: HTMLCanvasElement, labels: string[], data: number[]): Chart<'line'> {
    const line = token('--color-primary')
    const muted = token('--text-color-muted')
    const grid = token('--border-color-default')
    const surface = token('--background-color-raised')
    const text = token('--text-color-default')
    const font = { family: token('--font-sans') || 'sans-serif', size: 12 }

    return new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: line,
          borderWidth: 2,
          backgroundColor: withAlpha(line, 0.14),
          fill: 'origin',
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: surface,
          pointHoverBackgroundColor: line
        }]
      },
      options: {
        maintainAspectRatio: false,
        animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 400 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: surface,
            titleColor: muted,
            bodyColor: text,
            borderColor: grid,
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            titleFont: font,
            bodyFont: { ...font, size: 14, weight: 'bold' },
            callbacks: { label: item => rupees.format(item.parsed.y ?? 0) }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: grid },
            ticks: { color: muted, font, maxRotation: 0, autoSkipPadding: 12 }
          },
          y: {
            beginAtZero: true,
            grid: { color: grid },
            border: { display: false },
            ticks: { color: muted, font, maxTicksLimit: 5, callback: value => rupees.format(Number(value)) }
          }
        }
      }
    })
  }
}
