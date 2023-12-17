/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-approval-pending',
  templateUrl: './approval-pending.component.html',
  styleUrls: ['./approval-pending.component.css']
})
export class ApprovalPendingComponent {
  constructor (
    private readonly router: Router
  ) {}

  redirectUserToHome (): void {
    void this.router.navigate(['/user/home'])
  }
}
