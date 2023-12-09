import { CommonModule } from '@angular/common'
import { Component, type OnInit, EventEmitter, Output, Input } from '@angular/core'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<Date>()
  dates: Date[] = this.getDatesArray()
  @Input() currDate: Date = new Date()

  ngOnInit (): void {
    console.log(this.dates, 'dates from shows')
  }

  event (event: any): void {
    console.log(event)
  }

  onSelectDate (date: Date): void {
    console.log('emitting event from date component')
    this.dateSelected.emit(date)
  }

  getDatesArray (): Date[] {
    const datesArray = []
    const today = new Date('2023-11-28')

    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(today)
      nextDate.setDate(today.getDate() + i)
      datesArray.push(nextDate)
    }

    return datesArray
  }
}
