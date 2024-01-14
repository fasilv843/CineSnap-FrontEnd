/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subject, debounceTime } from 'rxjs'

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>()
  searchSubject = new Subject<string>()

  ngOnInit (): void {
    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(movieName => {
        this.searchEvent.emit(movieName)
      })
  }

  onSearch (movieName: string | null): void {
    if (movieName !== null) this.searchSubject.next(movieName)
  }
}
