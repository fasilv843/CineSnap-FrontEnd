import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { CsMoviesComponent } from '../../common/cs-movies/cs-movies.component'

@Component({
  selector: 'app-thr-movies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, PageHeaderComponent, CsMoviesComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
      <cs-page-header heading="Movies" description="The CineSnap catalogue. Any of these can be scheduled on your screens.">
        <a csButton routerLink="/theater/shows">Schedule a show</a>
      </cs-page-header>
      <app-cs-movies class="mt-6 block" />
    </main>
  `
})
export class ThrMoviesComponent {}
