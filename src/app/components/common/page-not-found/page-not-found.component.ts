
import { Component } from '@angular/core'

@Component({
    imports: [],
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
  goBack (): void {
    window.history.back()
  }
}
