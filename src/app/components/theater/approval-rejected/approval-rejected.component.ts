import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { environments } from 'src/environments/environment'

@Component({
  selector: 'app-approval-rejected',
  templateUrl: './approval-rejected.component.html',
  styleUrls: ['./approval-rejected.component.css']
})
export class ApprovalRejectedComponent implements OnInit {
  @Input() reason = 'Block'

  constructor (
    private readonly _route: ActivatedRoute
  ) {}

  ngOnInit (): void {
    this._route.queryParamMap.subscribe(params => {
      this.reason = params.get('reason') as string
      console.log(this.reason, 'reason')
      console.log(params, 'params')
    })
  }

  contactSupport (): void {
    const mailSubject = this.reason === 'Block'
      ? 'Inquiry Regarding Theater Registration Rejection'
      : 'Inquiry Regarding Theater Block'
    window.location.href = `mailto:${environments.supportMail}?subject=${encodeURIComponent(mailSubject)}`
  }
}
