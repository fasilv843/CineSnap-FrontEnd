/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { Subject, debounceTime } from 'rxjs'

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>()
  searchSubject = new Subject<string>()

  ngOnInit (): void {
    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(movieName => {
        console.warn('search event emitted')
        this.searchEvent.emit(movieName)
      })
  }

  onSearch (movieName: string | null): void {
    console.log('search subject called next()')
    if (movieName !== null) this.searchSubject.next(movieName)
  }
}
