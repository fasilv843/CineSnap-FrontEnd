import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { createColumnHelper, injectTable, rowPaginationFeature, tableFeatures } from '@tanstack/angular-table'
import { map } from 'rxjs'
import { type IUserRes } from 'src/app/models/users'
import { UserService } from 'src/app/services/user.service'
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

// The server pages and searches, so the table only needs pagination state
const features = tableFeatures({ rowPaginationFeature })
const column = createColumnHelper<typeof features, IUserRes>()
const columns = column.columns([
  column.accessor('name', { header: 'Movie-goer' }),
  column.accessor('mobile', { header: 'Mobile' }),
  column.accessor('address', { header: 'Location' }),
  column.accessor('wallet', { header: 'Wallet' }),
  column.accessor('isBlocked', { header: 'Status' }),
  column.display({ id: 'actions', header: 'Actions' })
])

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, ButtonDirective, PageHeaderComponent, PaginationComponent, SearchFieldComponent, StatePanelComponent]
})
export class AdminUsersComponent {
  private readonly userService = inject(UserService)
  private readonly confirm = inject(ConfirmService)
  private readonly toast = inject(ToastService)

  protected readonly paging = injectUrlPaging()

  protected readonly users = rxResource({
    params: () => ({ page: this.paging.page(), limit: this.paging.limit(), q: this.paging.query() }),
    stream: ({ params }) => this.userService.getAllUsers(params.page, params.limit, params.q).pipe(
      map(res => res.data ?? { users: [], userCount: 0 })
    )
  })

  // Local copy so blocks show at once
  protected readonly rows = linkedSignal(() => valueOf(this.users)?.users ?? [])
  protected readonly total = computed(() => valueOf(this.users)?.userCount ?? 0)
  protected readonly busy = signal<string | null>(null)

  protected readonly table = injectTable(() => ({
    features,
    columns,
    data: this.rows(),
    getRowId: row => row._id,
    manualPagination: true,
    rowCount: this.total(),
    state: { pagination: { pageIndex: this.paging.page() - 1, pageSize: this.paging.limit() } }
  }))

  protected avatar (user: IUserRes): string | null {
    const pic = user.profilePic
    if (pic === undefined || pic === '') return null
    return pic.startsWith('http') ? pic : imagesFolderPath + pic // Google accounts keep their Google photo URL
  }

  protected async toggleBlock (user: IUserRes): Promise<void> {
    const blocking = !user.isBlocked
    const confirmed = await this.confirm.confirm({
      title: blocking ? `Block ${user.name}?` : `Unblock ${user.name}?`,
      message: blocking ? 'They can\'t sign in or book tickets until you unblock them.' : 'They can sign in and book tickets again.',
      confirmLabel: blocking ? 'Block' : 'Unblock',
      cancelLabel: 'Cancel',
      tone: blocking ? 'danger' : 'primary'
    })
    if (!confirmed) return
    this.busy.set(user._id)
    this.userService.blockUser(user._id).subscribe({
      next: () => {
        this.busy.set(null)
        this.rows.update(rows => rows.map(row => row._id === user._id ? { ...row, isBlocked: blocking } : row))
        this.toast.success(`${user.name} ${blocking ? 'blocked' : 'unblocked'}`)
      },
      error: () => { this.busy.set(null) }
    })
  }
}
