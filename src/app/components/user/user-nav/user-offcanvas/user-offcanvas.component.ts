import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NgbActiveOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-user-offcanvas',
  standalone: true,
  imports: [CommonModule, NgbOffcanvasModule],
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.css']
})
export class UserOffcanvasComponent {
  // private readonly _ngbActiveOffcanvas = inject(NgbActiveOffcanvas)
  constructor (
    private readonly _ngbActiveOffcanvas: NgbActiveOffcanvas
  ) {}

  onDismiss (reason: string): void {
    this._ngbActiveOffcanvas.dismiss(reason)
  }

  onClose (str: string): void {
    this._ngbActiveOffcanvas.close(str)
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
