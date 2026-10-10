/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-approval-pending',
    templateUrl: './approval-pending.component.html',
    styleUrls: ['./approval-pending.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ApprovalPendingComponent {
  private readonly router = inject(Router)

  redirectUserToHome (): void {
    void this.router.navigate(['/user/home'])
  }
}
