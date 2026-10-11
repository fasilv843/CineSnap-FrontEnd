import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { map } from 'rxjs'
import { AdminService } from 'src/app/services/admin.service'
import { TheaterService } from 'src/app/services/theater.service'
import { TicketService } from 'src/app/services/ticket.service'
import { UserService } from 'src/app/services/user.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { RevenueChartComponent } from 'src/app/shared/ui/revenue-chart.component'
import { StatTileComponent } from 'src/app/shared/ui/stat-tile.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { valueOf } from 'src/app/helpers/resource'

const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

@Component({
  selector: 'app-admin-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, PageHeaderComponent, RevenueChartComponent, StatTileComponent, StatePanelComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:py-10">
      <cs-page-header heading="Dashboard" description="CineSnap at a glance.">
        <a csButton routerLink="/admin/theaters">Review theaters</a>
        <a csButton variant="secondary" routerLink="/admin/movies/tmdb">Add movies</a>
      </cs-page-header>

      <section class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key figures">
        <cs-stat-tile label="Booking fees in this chart" [value]="revenueTotal()" [highlight]="true"
          [loading]="revenue.isLoading()" [error]="!!revenue.error()" (retried)="revenue.reload()" />
        <cs-stat-tile label="Tickets booked" [value]="counts().tickets" hint="All time"
          [loading]="tickets.isLoading()" [error]="!!tickets.error()" (retried)="tickets.reload()" />
        <cs-stat-tile label="Theaters" [value]="counts().theaters" hint="Including ones awaiting review"
          [loading]="theaters.isLoading()" [error]="!!theaters.error()" (retried)="theaters.reload()" />
        <cs-stat-tile label="Movie-goers" [value]="counts().users" hint="Accounts"
          [loading]="users.isLoading()" [error]="!!users.error()" (retried)="users.reload()" />
      </section>

      <section class="card mt-6 p-5" aria-labelledby="revenue-heading">
        <h2 id="revenue-heading" class="text-lg font-semibold">CineSnap revenue</h2>
        <p class="text-sm text-muted">Booking fees collected on tickets.</p>
        @if (revenue.error()) {
          <cs-state-panel heading="Revenue couldn't be loaded" [retry]="true" (retried)="revenue.reload()" />
        } @else if (revenue.isLoading()) {
          <div class="skeleton mt-4 h-72"></div>
        } @else if (!hasRevenue()) {
          <cs-state-panel heading="No revenue yet" message="Booking fees show up here as tickets sell." />
        } @else if (revenue.value(); as data) {
          <cs-revenue-chart class="mt-4" [revenue]="data" label="CineSnap revenue" />
        }
      </section>
    </main>
  `
})
export class AdminHomeComponent {
  private readonly adminService = inject(AdminService)
  private readonly ticketService = inject(TicketService)
  private readonly theaterService = inject(TheaterService)
  private readonly userService = inject(UserService)

  protected readonly revenue = rxResource({
    stream: () => this.adminService.getRevenueData().pipe(map(res => res.data ?? { labels: [], data: [] }))
  })

  // Only the counts are needed, so ask for a single row of each list
  protected readonly tickets = rxResource({
    stream: () => this.ticketService.getAllTickets(1, 1).pipe(map(res => res.data?.ticketCount ?? 0))
  })

  protected readonly theaters = rxResource({
    stream: () => this.theaterService.getAllTheaters(1, 1, '').pipe(map(res => res.data?.theaterCount ?? 0))
  })

  protected readonly users = rxResource({
    stream: () => this.userService.getAllUsers(1, 1, '').pipe(map(res => res.data?.userCount ?? 0))
  })

  protected readonly revenueTotal = computed(() => rupees.format((valueOf(this.revenue)?.data ?? []).reduce((sum, value) => sum + value, 0)))
  protected readonly counts = computed(() => ({ tickets: valueOf(this.tickets) ?? 0, theaters: valueOf(this.theaters) ?? 0, users: valueOf(this.users) ?? 0 }))
  protected readonly hasRevenue = computed(() => (valueOf(this.revenue)?.data ?? []).some(value => value > 0))
}
