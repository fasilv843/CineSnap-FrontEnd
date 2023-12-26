/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, type OnInit, Output, Input } from '@angular/core'
import { type FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms'

@Component({
  selector: 'app-table-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements OnInit {
  @Output() search = new EventEmitter<string>()
  @Output() pageChange = new EventEmitter<number>()
  @Output() itemsPerPageChange = new EventEmitter<number>()
  searchForm!: FormGroup
  currentPage = 1
  itemsPerPage = 10
  @Input() totalItems: number = 0

  constructor (
    private readonly fb: FormBuilder
  ) {}

  ngOnInit (): void {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    })
  }

  onPageChange (page: number): void {
    this.currentPage = page
    this.pageChange.emit(page)
  }

  onItemsPerPageChange (itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage
    this.currentPage = 1
    this.itemsPerPageChange.emit(itemsPerPage)
  }

  onSearch (): void {
    const searchQuery = this.searchForm.get('searchQuery')?.value
    console.log(searchQuery, 'searched query from onSearch()')
    this.search.emit(searchQuery)
  }
}
