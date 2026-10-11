import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { StatusPageComponent } from 'src/app/shared/ui/status-page.component'

@Component({
  selector: 'app-approval-pending',
  imports: [RouterLink, ButtonDirective, StatusPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-status-page label="Under review" heading="Thanks, we've got your registration">
      <ng-container message>
        <p>Our team checks every theater before it goes live. This usually takes 3 to 5 business days.</p>
        <p>Once you're approved, sign in with the email and password you registered with.</p>
      </ng-container>
      <a csButton routerLink="/theater/login">Theater sign in</a>
      <a csButton variant="secondary" routerLink="/user/home">Browse movies meanwhile</a>
    </cs-status-page>
  `
})
export class ApprovalPendingComponent {}
