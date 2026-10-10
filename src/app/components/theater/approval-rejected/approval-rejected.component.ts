/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { environments } from 'src/environments/environment'

@Component({
    selector: 'app-approval-rejected',
    templateUrl: './approval-rejected.component.html',
    styleUrls: ['./approval-rejected.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ApprovalRejectedComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute)

  readonly reason = signal('Block')

  ngOnInit (): void {
    this._route.queryParamMap.subscribe(params => {
      this.reason.set(params.get('reason') as string)
      console.log(this.reason(), 'reason')
      console.log(params, 'params')
    })
  }

  contactSupport (): void {
    const mailSubject = this.reason() === 'Block'
      ? 'Inquiry Regarding Theater Registration Rejection'
      : 'Inquiry Regarding Theater Block'
    window.location.href = `mailto:${environments.supportMail}?subject=${encodeURIComponent(mailSubject)}`
  }
}
