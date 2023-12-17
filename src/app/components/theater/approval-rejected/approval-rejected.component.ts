import { Component } from '@angular/core'
import { environments } from 'src/environments/environment'

@Component({
  selector: 'app-approval-rejected',
  templateUrl: './approval-rejected.component.html',
  styleUrls: ['./approval-rejected.component.css']
})
export class ApprovalRejectedComponent {
  contactSupport (): void {
    window.location.href = `mailto:${environments.supportMail}?subject=${encodeURIComponent('Inquiry Regarding Theater Registration Rejection')}`
  }
}
