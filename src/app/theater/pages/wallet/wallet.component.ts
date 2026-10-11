import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { createColumnHelper, injectTable, rowPaginationFeature, tableFeatures } from '@tanstack/angular-table'
import { map } from 'rxjs'
import { type IWalletHistory } from 'src/app/core/models/api.model'
import { TheaterAccountRepo } from 'src/app/theater/repos/account.repo'
import { TheaterWalletService } from 'src/app/theater/services/wallet.service'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { IconComponent } from 'src/app/shared/ui/icon.component'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { PaginationComponent } from 'src/app/shared/ui/pagination.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { injectUrlPaging } from 'src/app/shared/ui/url-paging'
import { selectTheaterDetails } from 'src/app/core/state/theater/theater.selector'
import { valueOf } from 'src/app/shared/utils/resource'

// The server pages the history, so the table only needs pagination state (no client row models)
const features = tableFeatures({ rowPaginationFeature })
const column = createColumnHelper<typeof features, IWalletHistory>()
const columns = column.columns([
  column.accessor('date', { header: 'Date' }),
  column.accessor('message', { header: 'Description' }),
  column.accessor('amount', { header: 'Amount' })
])

@Component({
  selector: 'app-thr-wallet',
  templateUrl: './wallet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, ButtonDirective, IconComponent, PageHeaderComponent, PaginationComponent, StatePanelComponent]
})
export class TheaterWalletComponent {
  private readonly accountRepo = inject(TheaterAccountRepo)
  private readonly wallet = inject(TheaterWalletService)

  protected readonly theater = inject(Store).selectSignal(selectTheaterDetails)
  protected readonly paging = injectUrlPaging()

  protected readonly history = rxResource({
    params: () => ({ theaterId: this.theater()?._id ?? '', page: this.paging.page(), limit: this.paging.limit() }),
    stream: ({ params }) => this.accountRepo.getTheaterWalletHistory(params.theaterId, params.page, params.limit).pipe(
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
    state: { pagination: { pageIndex: this.paging.page() - 1, pageSize: this.paging.limit() } }
  }))

  protected addMoney (): void {
    const theater = this.theater()
    if (theater !== null) this.wallet.addMoney(theater)
  }
}
