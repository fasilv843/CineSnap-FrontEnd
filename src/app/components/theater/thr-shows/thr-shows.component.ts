import { Component, type OnInit } from '@angular/core'

@Component({
  selector: 'app-thr-shows',
  templateUrl: './thr-shows.component.html',
  styleUrls: ['./thr-shows.component.css']
})
export class ThrShowsComponent implements OnInit {
  ngOnInit (): void {
    console.log('show init')
  }

  onSelectDate (date: Date): void {
    console.log(date, 'date selected from onSelectDate')
  }
}
