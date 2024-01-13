import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
  goBack (): void {
    window.history.back()
  }
}
