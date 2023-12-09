import { CommonModule } from '@angular/common'
import { Component, type OnInit, EventEmitter, Output, Input } from '@angular/core'
import { getDatesArray } from 'src/app/helpers/date'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<Date>()
  dates: Date[] = getDatesArray()
  @Input() currDate: Date = new Date()

  ngOnInit (): void {
    console.log(this.dates, 'dates from shows')
  }

  onDateChange (event: Event): void {
    const selectedDate: Date | null = (event.target as HTMLInputElement).valueAsDate
    console.log(selectedDate, 'date picked event')
    if (selectedDate !== null) {
      this.dateSelected.emit(selectedDate)
    }
  }

  onSelectDate (date: Date): void {
    console.log('emitting event from date component')
    this.dateSelected.emit(date)
  }

  isCurrDate (date: Date): boolean {
    // Compare the date with currDate and return true if they match
    return date.toDateString() === this.currDate.toDateString()
  }
}
