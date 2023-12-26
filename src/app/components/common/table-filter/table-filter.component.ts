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
  totalPages = 1
  dynamicPages: number[] = [1, 2, 3]

  constructor (
    private readonly fb: FormBuilder
  ) {}

  ngOnInit (): void {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    })
  }

  getTotalPage (): number {
    return Math.ceil(this.totalItems / this.itemsPerPage)
  }

  onPageChange (page: number): void {
    this.currentPage = page
    this.calculateDynamicPages(page)
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

  getPagesArray (): number[] {
    console.log(this.getTotalPage(), 'total page from getpagesArray')
    return Array.from({ length: this.getTotalPage() }, (_, index) => index + 1)
  }

  calculateDynamicPages (currentPage: number): void {
    const maxVisiblePages = 3 // Adjust this based on the number of pages you want to show
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(this.getTotalPage(), startPage + maxVisiblePages - 1)

    this.dynamicPages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
  }
}
