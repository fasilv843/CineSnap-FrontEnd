/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, type OnInit } from '@angular/core'
import { IApiUsersRes, type IUserRes } from 'src/app/models/users'
import { UserService } from 'src/app/services/user.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: IUserRes[] = []

  constructor (
    private readonly userService: UserService
  ) {}

  ngOnInit (): void {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data
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
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                { ...this.users[userIdx], isBlocked: !this.users[userIdx].isBlocked },
                ...this.users.slice(userIdx + 1)
              ]
            }
          }
        })
      }
    })
  }
}
