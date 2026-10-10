/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, EventEmitter, OnDestroy, OnInit, Output, ChangeDetectionStrategy } from '@angular/core'

import { Subject, debounceTime } from 'rxjs'

@Component({
    selector: 'app-search',
    imports: [],
    templateUrl: './search.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() searchEvent = new EventEmitter<string>()
  searchSubject = new Subject<string>()

  ngOnInit (): void {
    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(movieName => {
        this.searchEvent.emit(movieName)
      })
  }

  ngOnDestroy (): void {
    this.searchSubject.unsubscribe()
  }

  onSearch (movieName: string | null): void {
    if (movieName !== null) this.searchSubject.next(movieName)
  }
}
