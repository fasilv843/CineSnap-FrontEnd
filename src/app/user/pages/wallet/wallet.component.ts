import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { createColumnHelper, injectTable, rowPaginationFeature, tableFeatures } from '@tanstack/angular-table'
import { map } from 'rxjs'
import { type IWalletHistory } from 'src/app/models/common'
import { UserService } from 'src/app/services/user.service'
import { WalletTopUpService } from 'src/app/services/wallet-top-up.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { PaginationComponent } from 'src/app/shared/ui/pagination.component'
import { selectUserDetails } from 'src/app/states/user/user.selector'
import { UserNavComponent } from '../user-nav/user-nav.component'
import { valueOf } from 'src/app/helpers/resource'

const PAGE_SIZES = [10, 20, 50]

// The server pages the history, so the table only needs pagination state (no client row models)
const features = tableFeatures({ rowPaginationFeature })
const column = createColumnHelper<typeof features, IWalletHistory>()
const columns = column.columns([
  column.accessor('date', { header: 'Date' }),
  column.accessor('message', { header: 'Description' }),
  column.accessor('amount', { header: 'Amount' })
])

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, ButtonDirective, PaginationComponent, DatePipe]
})
export class UserWalletComponent {
  private readonly store = inject(Store)
  private readonly userService = inject(UserService)
  private readonly walletTopUp = inject(WalletTopUpService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  protected readonly user = this.store.selectSignal(selectUserDetails)
  protected readonly pageSizes = PAGE_SIZES

  // Page and page size live in the URL (?page=2&limit=20) so reloads and back keep the place
  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true })
  protected readonly page = computed(() => Math.max(1, Number(this.params().get('page') ?? 1) || 1))
  protected readonly limit = computed(() => {
    const limit = Number(this.params().get('limit'))
    return PAGE_SIZES.includes(limit) ? limit : PAGE_SIZES[0]
  })

  protected readonly history = rxResource({
    params: () => ({ userId: this.user()?._id ?? '', page: this.page(), limit: this.limit() }),
    stream: ({ params }) => this.userService.getUserWalletHistory(params.userId, params.page, params.limit).pipe(
      map(res => res.data ?? { walletHistory: [], count: 0 })
    )
  })

  private readonly rows = computed(() => valueOf(this.history)?.walletHistory ?? [])
  protected readonly total = computed(() => valueOf(this.history)?.count ?? 0)

  protected readonly table = injectTable(() => ({
    features,
    columns,
    data: this.rows(),
    manualPagination: true,
    rowCount: this.total(),
    state: { pagination: { pageIndex: this.page() - 1, pageSize: this.limit() } }
  }))

  protected readonly skeletonRows = [0, 1, 2, 3, 4]

  protected goToPage (page: number): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page }, queryParamsHandling: 'merge' })
  }

  protected setPageSize (limit: number): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1, limit }, queryParamsHandling: 'merge' })
  }

  protected addMoney (): void {
    const user = this.user()
    if (user !== null) this.walletTopUp.addMoney(user)
  }
}
