import { Component, type OnDestroy, type OnInit, signal, ChangeDetectionStrategy, input } from '@angular/core'


export interface ICarouselData {
  imageUrl: string
  title: string
}

const SLIDE_INTERVAL = 3000

@Component({
    selector: 'app-carousel',
    imports: [],
    templateUrl: './carousel.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  readonly images = input<ICarouselData[]>([]);

  activeIndex = signal(0)
  private paused = false
  private timer?: ReturnType<typeof setInterval>

  ngOnInit (): void {
    this.timer = setInterval(() => {
      if (!this.paused) this.next()
    }, SLIDE_INTERVAL)
  }

  ngOnDestroy (): void {
    clearInterval(this.timer)
  }

  next (): void {
    if (this.images().length === 0) return
    this.activeIndex.update(i => (i + 1) % this.images().length)
  }

  prev (): void {
    if (this.images().length === 0) return
    this.activeIndex.update(i => (i - 1 + this.images().length) % this.images().length)
  }

  setPaused (paused: boolean): void {
    this.paused = paused
  }
}
