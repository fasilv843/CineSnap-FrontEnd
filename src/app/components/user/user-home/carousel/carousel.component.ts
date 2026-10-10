import { Component, Input, type OnDestroy, type OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'

export interface ICarouselData {
  imageUrl: string
  title: string
}

const SLIDE_INTERVAL = 3000

@Component({
    selector: 'app-carousel',
    imports: [CommonModule],
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() images: ICarouselData[] = []

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
    if (this.images.length === 0) return
    this.activeIndex.update(i => (i + 1) % this.images.length)
  }

  prev (): void {
    if (this.images.length === 0) return
    this.activeIndex.update(i => (i - 1 + this.images.length) % this.images.length)
  }

  setPaused (paused: boolean): void {
    this.paused = paused
  }
}
