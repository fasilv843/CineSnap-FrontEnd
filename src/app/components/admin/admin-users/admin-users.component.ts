/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit } from '@angular/core'
import { type IUserRes } from 'src/app/models/users'
import { UserService } from 'src/app/services/user.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: IUserRes[] = []
  currPage = 1
  itemsPerPage = 10
  searchQuery: string = ''
  userCount = 0

  constructor (
    private readonly userService: UserService
  ) {}

  ngOnInit (): void {
    this.getUsers()
  }

  getUsers (): void {
    this.userService.getAllUsers(this.currPage, this.itemsPerPage, this.searchQuery).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.users = res.data.users
          this.userCount = res.data.userCount
        }
      }
    })
  }

  onBlock (userId: string, action: 'Block' | 'Unblock'): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this user!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} him/her`,
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.blockUser(userId).subscribe({
          next: () => {
            const userIdx = this.users.findIndex(user => user._id === userId)
            if (userIdx !== -1) {
              this.users = [
                ...this.users.slice(0, userIdx),
                { ...this.users[userIdx], isBlocked: !this.users[userIdx].isBlocked },
                ...this.users.slice(userIdx + 1)
              ]
            }
          }
        })
      }
    })
  }

  onSearchUsers (searchQuery: string): void {
    this.searchQuery = searchQuery
    this.getUsers()
  }

  onPageChange (page: number): void {
    this.currPage = page
    this.getUsers()
  }

  onItemsPerPageChange (itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage
    this.currPage = 1
    this.getUsers()
  }
}
