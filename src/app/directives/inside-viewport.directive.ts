// /* eslint-disable @typescript-eslint/consistent-type-imports */
// import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core'

// @Directive({
//   selector: '[appInsideViewport]'
// })
// export class InsideViewportDirective {
//   @Input() messageId: string = ''
//   @Output() insideViewport = new EventEmitter<CustomEvent<{ messageId: string, isInView: boolean }>>()

//   constructor (private readonly elementRef: ElementRef) {}

//   @HostListener('scroll', ['$event'])
//   public onScrollBy (): void {
//     const windowHeight = window.innerHeight
//     const boundedRect = this.elementRef.nativeElement.getBoundingClientRect()

//     const eventDetail = { messageId: this.messageId, isInView: boundedRect.top >= 0 && boundedRect.bottom <= windowHeight }

//     const customEvent = new CustomEvent('insideViewport', { detail: eventDetail })
//     this.insideViewport.emit(customEvent)
//   }
// }
