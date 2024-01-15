/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common'
import {  AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  selector: 'app-scroll-h-tabs',
  templateUrl: './scroll-h-tabs.component.html',
  styleUrls: ['./scroll-h-tabs.component.css']
})
export class ScrollHTabsComponent {
  @Input() labels: string[] = []
  @Input() labelTitle: string = 'Labels'
  @Output() labelClick = new EventEmitter<string>()
  @ViewChild('labelsContainer') labelsContainer!: ElementRef<HTMLDivElement>

  @HostListener('window:resize', ['$event'])
  onResize (event: Event): void {
    this.updateScrollArrows()
  }

  private readonly scollAmount = 100
  showLeftArrow = false
  showRightArrow = true

  updateScrollArrows (): void {
    setTimeout(() => {
      const tabsEl = this.labelsContainer.nativeElement as HTMLElement
      this.showLeftArrow = tabsEl.scrollLeft > 0
      this.showRightArrow = tabsEl.scrollWidth > tabsEl.clientWidth && tabsEl.scrollWidth - tabsEl.clientWidth > tabsEl.scrollLeft
    }, 100)
  }

  scrollLeft (): void {
    this.labelsContainer.nativeElement.scrollBy({ left: -this.scollAmount, behavior: 'smooth' })
    this.updateScrollArrows()
  }

  scrollRight (): void {
    this.labelsContainer.nativeElement.scrollBy({ left: this.scollAmount, behavior: 'smooth' })
    this.updateScrollArrows()
  }

  onClickLabel (label: string): void {
    this.labelClick.emit(label)
  }
}
