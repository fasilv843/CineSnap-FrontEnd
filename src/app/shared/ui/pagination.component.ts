import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core'

type PageItem = number | 'gap'

/** Builds e.g. [1, 'gap', 4, 5, 6, 'gap', 12] around the current page. */
function pageItems (current: number, last: number): PageItem[] {
  const pages = new Set([1, last, current - 1, current, current + 1].filter(page => page >= 1 && page <= last))
  const sorted = [...pages].sort((a, b) => a - b)
  const items: PageItem[] = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push('gap')
    items.push(page)
  })
  return items
}

/** Page navigation plus a rows-per-page picker. Pages are 1-based. Works for client- or server-side paging. */
@Component({
  selector: 'cs-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between" aria-label="Pagination">
      <div class="flex items-center gap-3 text-muted">
        <span aria-live="polite">
          @if (total() > 0) {
            Showing {{ from() }}–{{ to() }} of {{ total() }}
          } @else {
            No results
          }
        </span>
        <label class="flex items-center gap-2">
          <span>Rows per page</span>
          <select class="page-size" [value]="pageSize()" (change)="pageSizeChange.emit(+$any($event.target).value)">
            @for (size of pageSizes(); track size) {
              <option [value]="size" [selected]="size === pageSize()">{{ size }}</option>
            }
          </select>
        </label>
      </div>

      @if (lastPage() > 1) {
        <ul class="flex items-center gap-1" role="list">
          <li>
            <button type="button" class="page-btn" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)" aria-label="Previous page">‹</button>
          </li>
          @for (item of items(); track $index) {
            <li>
              @if (item === 'gap') {
                <span class="px-1 text-subtle" aria-hidden="true">…</span>
              } @else {
                <button type="button" class="page-btn" [attr.aria-current]="item === page() ? 'page' : null"
                  (click)="pageChange.emit(item)" [attr.aria-label]="'Page ' + item">{{ item }}</button>
              }
            </li>
          }
          <li>
            <button type="button" class="page-btn" [disabled]="page() >= lastPage()" (click)="pageChange.emit(page() + 1)" aria-label="Next page">›</button>
          </li>
        </ul>
      }
    </nav>
  `,
  styles: `
    .page-size {
      height: 2rem;
      padding-inline: 0.5rem;
      border: 1px solid var(--border-color-input);
      border-radius: var(--radius-control);
      background-color: var(--background-color-surface);
      color: var(--text-color-default);
    }

    .page-btn {
      min-width: 2rem;
      height: 2rem;
      padding-inline: 0.5rem;
      border-radius: var(--radius-control);
      font-weight: 600;
      color: var(--text-color-muted);
    }

    .page-btn:hover:not(:disabled) {
      background-color: var(--background-color-muted);
      color: var(--text-color-default);
    }

    .page-btn:disabled {
      opacity: 0.4;
    }

    .page-btn[aria-current='page'] {
      background-color: var(--color-primary);
      color: var(--color-primary-foreground);
    }
  `
})
export class PaginationComponent {
  readonly page = input.required<number>()
  readonly pageSize = input.required<number>()
  readonly total = input.required<number>()
  readonly pageSizes = input([10, 20, 50])

  readonly pageChange = output<number>()
  readonly pageSizeChange = output<number>()

  protected readonly lastPage = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())))
  protected readonly from = computed(() => (this.page() - 1) * this.pageSize() + 1)
  protected readonly to = computed(() => Math.min(this.total(), this.page() * this.pageSize()))
  protected readonly items = computed(() => pageItems(this.page(), this.lastPage()))
}
