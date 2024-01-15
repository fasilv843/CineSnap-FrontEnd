/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
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
  @ViewChild('labelsContainer') labelsContainer!: ElementRef

  scrollLeft (): void {
    this.labelsContainer.nativeElement.scrollLeft -= 100 // Adjust the scroll amount as needed
  }

  scrollRight (): void {
    this.labelsContainer.nativeElement.scrollLeft += 100 // Adjust the scroll amount as needed
  }

  onClickLabel (label: string): void {
    this.labelClick.emit(label)
  }
}
