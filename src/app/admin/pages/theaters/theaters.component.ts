import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { createColumnHelper, injectTable, rowPaginationFeature, tableFeatures } from '@tanstack/angular-table'
import { type Observable, map } from 'rxjs'
import { type ITheaterRes } from 'src/app/models/theater'
import { TheaterService } from 'src/app/services/theater.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { AvatarComponent } from 'src/app/shared/ui/avatar.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { ConfirmService } from 'src/app/shared/ui/confirm-dialog.component'
import { PageHeaderComponent } from 'src/app/shared/ui/page-header.component'
import { PaginationComponent } from 'src/app/shared/ui/pagination.component'
import { SearchFieldComponent } from 'src/app/shared/ui/search-field.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { ToastService } from 'src/app/shared/ui/toast.service'
import { injectUrlPaging } from 'src/app/shared/ui/url-paging'
import { valueOf } from 'src/app/helpers/resource'

type TheaterStatus = 'pending' | 'approved' | 'rejected' | 'blocked'
type Action = 'approve' | 'reject' | 'block' | 'unblock'

const STATUS: Record<TheaterStatus, { label: string, tone: string | null }> = {
  pending: { label: 'Pending review', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: null },
  blocked: { label: 'Blocked', tone: 'danger' }
}

function statusOf (theater: ITheaterRes): TheaterStatus {
  if (theater.approvalStatus === 'Pending') return 'pending'
  if (theater.approvalStatus === 'Rejected') return 'rejected'
  return theater.isBlocked ? 'blocked' : 'approved'
}

// The server pages and searches, so the table only needs pagination state
const features = tableFeatures({ rowPaginationFeature })
const column = createColumnHelper<typeof features, ITheaterRes>()
const columns = column.columns([
  column.accessor('name', { header: 'Theater' }),
  column.accessor('email', { header: 'Contact' }),
  column.accessor('address', { header: 'Location' }),
  column.accessor('wallet', { header: 'Wallet' }),
  column.display({ id: 'status', header: 'Status' }),
  column.display({ id: 'actions', header: 'Actions' })
])

@Component({
  selector: 'app-admin-theaters',
  templateUrl: './admin-theaters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, ButtonDirective, PageHeaderComponent, PaginationComponent, SearchFieldComponent, StatePanelComponent]
})
export class AdminTheatersComponent {
  private readonly theaterService = inject(TheaterService)
  private readonly confirm = inject(ConfirmService)
  private readonly toast = inject(ToastService)

  protected readonly paging = injectUrlPaging()

  protected readonly theaters = rxResource({
    params: () => ({ page: this.paging.page(), limit: this.paging.limit(), q: this.paging.query() }),
    stream: ({ params }) => this.theaterService.getAllTheaters(params.page, params.limit, params.q).pipe(
      map(res => res.data ?? { theaters: [], theaterCount: 0 })
    )
  })

  // Local copy so approvals and blocks show at once
  protected readonly rows = linkedSignal(() => valueOf(this.theaters)?.theaters ?? [])
  protected readonly total = computed(() => valueOf(this.theaters)?.theaterCount ?? 0)
  protected readonly busy = signal<string | null>(null)
  protected readonly status = STATUS
  protected readonly statusOf = statusOf

  protected readonly table = injectTable(() => ({
    features,
    columns,
    data: this.rows(),
    getRowId: row => row._id,
    manualPagination: true,
    rowCount: this.total(),
    state: { pagination: { pageIndex: this.paging.page() - 1, pageSize: this.paging.limit() } }
  }))

  protected avatar (theater: ITheaterRes): string | null {
    return theater.profilePic !== undefined && theater.profilePic !== '' ? imagesFolderPath + theater.profilePic : null
  }

  protected async act (theater: ITheaterRes, action: Action): Promise<void> {
    const copy = {
      approve: { title: `Approve ${theater.name}?`, message: 'They can sign in, add screens and start selling tickets.', confirm: 'Approve', tone: 'primary' as const, done: 'approved' },
      reject: { title: `Reject ${theater.name}?`, message: 'They can\'t sign in. They see a page telling them to contact support.', confirm: 'Reject', tone: 'danger' as const, done: 'rejected' },
      block: { title: `Block ${theater.name}?`, message: 'They can\'t sign in or sell tickets until you unblock them.', confirm: 'Block', tone: 'danger' as const, done: 'blocked' },
      unblock: { title: `Unblock ${theater.name}?`, message: 'They can sign in and sell tickets again.', confirm: 'Unblock', tone: 'primary' as const, done: 'unblocked' }
    }[action]

    const confirmed = await this.confirm.confirm({ title: copy.title, message: copy.message, confirmLabel: copy.confirm, cancelLabel: 'Cancel', tone: copy.tone })
    if (!confirmed) return

    const request: Observable<unknown> = action === 'approve'
      ? this.theaterService.approveTheater(theater._id)
      : action === 'reject' ? this.theaterService.rejectTheater(theater._id) : this.theaterService.blockTheater(theater._id)

    const change: Partial<ITheaterRes> = action === 'approve'
      ? { approvalStatus: 'Approved' }
      : action === 'reject' ? { approvalStatus: 'Rejected' } : { isBlocked: action === 'block' }

    this.busy.set(theater._id)
    request.subscribe({
      next: () => {
        this.busy.set(null)
        this.rows.update(rows => rows.map(row => row._id === theater._id ? { ...row, ...change } : row))
        this.toast.success(`${theater.name} ${copy.done}`)
      },
      error: () => { this.busy.set(null) }
    })
  }
}
