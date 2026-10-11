import { ChangeDetectionStrategy, Component } from '@angular/core'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { CsMoviesComponent } from '../../common/cs-movies/cs-movies.component'
import { AdminMoviesTabsComponent } from '../admin-movies-search/admin-movies-search.component'

@Component({
  selector: 'app-admin-cs-movies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, CsMoviesComponent, AdminMoviesTabsComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
      <cs-page-header heading="Movies" description="Remove a movie to hide it everywhere; restore it any time." />
      <app-admin-movies-tabs class="mt-6 block" />
      <app-cs-movies class="mt-6 block" [admin]="true" />
    </main>
  `
})
export class AdminCsMoviesComponent {}
