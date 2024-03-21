import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbCarouselModule, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'

export interface ICarouselData {
  imageUrl: string
  title: string
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  providers: [NgbCarouselConfig]
})
export class CarouselComponent {
  constructor (config: NgbCarouselConfig) {
    config.wrap = true
    config.interval = 3000
    config.showNavigationArrows = true
  }

  @Input() images: ICarouselData[] = []
}
