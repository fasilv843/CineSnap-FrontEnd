/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Directive, ElementRef, Input, Renderer2, type OnInit } from '@angular/core'
import { type ISelectedSeat } from '../models/ticket'
import { IShowSeat } from '../models/show'

@Directive({
  selector: '[appSeatStatus]'
})
export class SeatStatusDirective implements OnInit {
  @Input() row = ''
  @Input() col!: IShowSeat
  @Input() isBooked = false
  private _holdedSeats: ISelectedSeat[] = []

  @Input()
  set holdedSeats (value: ISelectedSeat[]) {
    this._holdedSeats = value
    this.applyStatusClasses()
  }

  get holdedSeats (): ISelectedSeat[] {
    return this._holdedSeats
  }

  constructor (
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) { }

  ngOnInit (): void {
    // console.warn('seat status directive is initializing')
    this.applyStatusClasses()
  }

  private applyStatusClasses (): void {
    const classesToRemove = ['booked', 'holded']

    // Remove existing classes
    classesToRemove.forEach(className => {
      this.renderer.removeClass(this.el.nativeElement, className)
    })

    if (this.col.isBooked) {
      this.renderer.addClass(this.el.nativeElement, 'booked')
    } else if (this.isSeatHolded()) {
      this.renderer.addClass(this.el.nativeElement, 'holded')
    }
  }

  private isSeatHolded (): boolean {
    return this.holdedSeats.some(seat => seat.row === this.row && seat.col === this.col.col)
  }
}
