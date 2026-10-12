import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ThemeService } from './core/theme/theme.service'
import { ToastHostComponent } from './core/toast/toast-host.component'
import { ServerStatusService } from './core/server-status/server-status.service'
import { ServerWakeComponent } from './core/server-status/server-wake.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ToastHostComponent, ServerWakeComponent]
})
export class AppComponent {
  // Created at boot so the theme class stays on <html> for every page
  private readonly theme = inject(ThemeService)

  constructor () {
    // Detects a sleeping server and shows <app-server-wake> while it starts
    inject(ServerStatusService).start()
  }
}
