/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/semi */
import { Component } from '@angular/core';
import { ITheater } from 'src/app/models/theater';
import { TheaterService } from 'src/app/services/theater.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-theaters',
  templateUrl: './admin-theaters.component.html',
  styleUrls: ['./admin-theaters.component.css']
})
export class AdminTheatersComponent {
  theaters: ITheater[] = []

  constructor (
    private readonly theaterService: TheaterService
  ) {}

  ngOnInit (): void {
    this.theaterService.getAllTheaters().subscribe({
      next: (res: ITheater[]) => {
        this.theaters = res
      },
      error: (err) => {
        void Swal.fire('Error', err.message, 'error')
      }
    })
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
          },
          error: (err) => {
            void Swal.fire('Error', err.error.message, 'error')
          }
        })
      }
    })
  }
}
