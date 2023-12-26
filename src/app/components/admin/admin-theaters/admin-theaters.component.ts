/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component } from '@angular/core';
import { ITheaterRes } from 'src/app/models/theater';
import { TheaterService } from 'src/app/services/theater.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-theaters',
  templateUrl: './admin-theaters.component.html',
  styleUrls: ['./admin-theaters.component.css']
})
export class AdminTheatersComponent {
  theaters: ITheaterRes[] = []
  currPage = 1
  itemsPerPage = 10
  searchQuery: string = ''
  theaterCount = 0

  constructor (
    private readonly theaterService: TheaterService
  ) {}

  ngOnInit (): void {
    this.getTheaters()
  }

  getTheaters (): void {
    this.theaterService.getAllTheaters(this.currPage, this.itemsPerPage, this.searchQuery).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.theaters = res.data.theaters
          this.theaterCount = res.data.theaterCount
        }
      }
    })
  }

  onSearchTheaters (searchQuery: string): void {
    this.searchQuery = searchQuery
    this.getTheaters()
  }

  onPageChange (page: number): void {
    this.currPage = page
    this.getTheaters()
  }

  onItemsPerPageChange (itemsPerPage: number): void {
    console.log(itemsPerPage, 'itemsPer Page')
    this.itemsPerPage = itemsPerPage
    this.currPage = 1
    this.getTheaters()
  }

  onBlock (theaterId: string, action: 'Block' | 'Unblock'): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this theater!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.isConfirmed) {
        this.theaterService.blockTheater(theaterId).subscribe({
          next: () => {
            const thrIndex = this.theaters.findIndex(thr => thr._id === theaterId)
            this.theaters = [
              ...this.theaters.slice(0, thrIndex),
              { ...this.theaters[thrIndex], isBlocked: !(this.theaters[thrIndex].isBlocked ?? false) },
              ...this.theaters.slice(thrIndex + 1)
            ]
          }
        })
      }
    })
  }

  onApprove (theaterId: string): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Approve this theater!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.isConfirmed) {
        this.theaterService.approveTheater(theaterId).subscribe({
          next: () => {
            const thrIndex = this.theaters.findIndex(thr => thr._id === theaterId)
            this.theaters = [
              ...this.theaters.slice(0, thrIndex),
              { ...this.theaters[thrIndex], approvalStatus: 'Approved' },
              ...this.theaters.slice(thrIndex + 1)
            ]
            console.log(this.theaters[thrIndex], 'approved theater')
          }
        })
      }
    })
  }

  onReject (theaterId: string): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Reject this theater!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.isConfirmed) {
        this.theaterService.rejectTheater(theaterId).subscribe({
          next: () => {
            const thrIndex = this.theaters.findIndex(thr => thr._id === theaterId)
            this.theaters = [
              ...this.theaters.slice(0, thrIndex),
              { ...this.theaters[thrIndex], approvalStatus: 'Rejected' },
              ...this.theaters.slice(thrIndex + 1)
            ]
          }
        })
      }
    })
  }
}
