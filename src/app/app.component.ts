import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ThemeService } from './services/theme.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'CineSnap'
  // Created at boot so the theme class stays on <html> for every page
  private readonly theme = inject(ThemeService)
}
