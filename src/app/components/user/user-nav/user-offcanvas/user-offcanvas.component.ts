/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActiveModal } from 'src/app/services/modal.service'
import { Store } from '@ngrx/store'
import { selectUserDetails } from 'src/app/states/user/user.selector'

@Component({
  selector: 'app-user-offcanvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.css']
})
export class UserOffcanvasComponent implements OnInit {
  // private readonly activeModal = inject(ActiveModal)
  userDetails$ = this._store.select(selectUserDetails)
  isLoggedIn = false

  constructor (
    private readonly activeModal: ActiveModal,
    private readonly _store: Store
  ) {}

  ngOnInit (): void {
    this.userDetails$.subscribe((user) => {
      if (user != null) this.isLoggedIn = true
    })
  }

  onDismiss (reason: string): void {
    this.activeModal.dismiss(reason)
  }

  onClose (str: string): void {
    this.activeModal.close(str)
  }

  // closeResult = ''

  // open (content: TemplateRef<any>): void {
  //   this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
  //     (result) => {
  //       this.closeResult = `Closed with: ${result}`
  //       console.log('user offcanvas closed')
  //     },
  //     (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
  //       console.log('user offcanvas dismissed')
  //     }
  //   )
  // }

  // private getDismissReason (reason: any): string {
  //   switch (reason) {
  //     case OffcanvasDismissReasons.ESC:
  //       return 'by pressing ESC'
  //     case OffcanvasDismissReasons.BACKDROP_CLICK:
  //       return 'by clicking on the backdrop'
  //     default:
  //       return `with: ${reason}`
  //   }
  // }

  // onLogout (): void {
  //   console.log('user logged out')
  // }
}
