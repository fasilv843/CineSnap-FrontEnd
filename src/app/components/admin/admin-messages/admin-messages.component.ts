import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'

/** Admin chat isn't built in the backend yet; this page says so instead of showing a blank screen. */
@Component({
  selector: 'app-admin-messages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, PageHeaderComponent, StatePanelComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
      <cs-page-header heading="Messages" />
      <div class="card mt-6">
        <cs-state-panel heading="Admin messages aren't available yet" message="Theaters and movie-goers can already chat with each other. Admin chat is coming later.">
          <a csButton variant="secondary" size="sm" routerLink="/admin/home">Dashboard</a>
        </cs-state-panel>
      </div>
    </main>
  `
})
export class AdminMessagesComponent {}
