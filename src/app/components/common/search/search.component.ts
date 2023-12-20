/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms'

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
  @Output() search = new EventEmitter<string>()
  searchForm!: FormGroup

  ngOnInit (): void {
    this.searchForm = this.fb.group({
      movieName: [''] // You can provide an initial value here if needed
    })
  }

  constructor (
    private readonly fb: FormBuilder
  ) {}

  onSearch (): void {
    const movieName = this.searchForm.get('movieName')?.value
    console.log(movieName, 'searched name from onSearch()')
    this.search.emit(movieName)
  }
}
