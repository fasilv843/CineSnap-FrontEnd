/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-movies-search',
  templateUrl: './admin-movies-search.component.html',
  styleUrls: ['./admin-movies-search.component.css']
})
export class AdminMoviesSearchComponent {
  // @Input() searchRoute: string = ''
  @Output() search = new EventEmitter<string>()
  searchForm!: FormGroup;

  ngOnInit (): void {
    this.searchForm = this.fb.group({
      movieName: [''] // You can provide an initial value here if needed
    });
  }

  constructor (
    // private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {}

  onSearch (): void {
    const movieName = this.searchForm.get('movieName')?.value;
    console.log(movieName, 'searched name from onSearch()');
    this.search.emit(movieName);
  }
}
