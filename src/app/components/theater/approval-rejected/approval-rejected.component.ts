import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { environments } from 'src/environments/environment'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { StatusPageComponent } from 'src/app/shared/ui/status-page.component'

/** ?reason=Rejection after a declined registration; ?reason=Block (the default) when an admin blocks the theater. */
@Component({
  selector: 'app-approval-rejected',
  imports: [RouterLink, ButtonDirective, StatusPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (rejected()) {
      <cs-status-page label="Not approved" heading="Your registration wasn't approved" tone="danger">
        <p message>We couldn't approve this theater on CineSnap. Our support team can tell you why and what to send us.</p>
        <a csButton [href]="mailto()">Email support</a>
        <a csButton variant="secondary" routerLink="/theater/login">Back to sign in</a>
      </cs-status-page>
    } @else {
      <cs-status-page label="Blocked" heading="Your theater is blocked" tone="danger">
        <p message>A CineSnap admin has blocked this theater, so you can't sign in or sell tickets. Contact support to sort it out.</p>
        <a csButton [href]="mailto()">Email support</a>
        <a csButton variant="secondary" routerLink="/theater/login">Back to sign in</a>
      </cs-status-page>
    }
  `
})
export class ApprovalRejectedComponent {
  private readonly query = toSignal(inject(ActivatedRoute).queryParamMap, { requireSync: true })
  protected readonly rejected = computed(() => this.query().get('reason') === 'Rejection')

  protected readonly mailto = computed(() => {
    const subject = this.rejected() ? 'Question about my theater registration' : 'Question about my blocked theater'
    return `mailto:${environments.supportMail}?subject=${encodeURIComponent(subject)}`
  })
}
