import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core'
import { type ISelectedSeat } from '../models/ticket'
import { type IShowSeat } from '../models/show'

@Directive({ selector: '[appSeatStatus]' })
export class SeatStatusDirective {
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)

  readonly row = input('')
  readonly col = input.required<IShowSeat>()
  readonly isBooked = input(false)
  readonly holdedSeats = input<ISelectedSeat[]>([])

  constructor () {
    // Re-applies whenever the seat or the held-seat list changes
    effect(() => { this.applyStatusClasses() })
  }

  private applyStatusClasses (): void {
    const classesToRemove = ['booked', 'holded']

    // Remove existing classes
    classesToRemove.forEach(className => {
      this.renderer.removeClass(this.el.nativeElement, className)
    })

    if (this.col().isBooked) {
      this.renderer.addClass(this.el.nativeElement, 'booked')
    } else if (this.isSeatHolded()) {
      this.renderer.addClass(this.el.nativeElement, 'holded')
    }
  }

  private isSeatHolded (): boolean {
    return this.holdedSeats().some(seat => seat.row === this.row() && seat.col === this.col().col)
  }
}
