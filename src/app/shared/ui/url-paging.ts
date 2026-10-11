import { type Signal, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'

export const PAGE_SIZES = [10, 20, 50]

export interface UrlPaging {
  /** 1-based page from ?page= */
  page: Signal<number>
  /** Rows per page from ?limit=, one of PAGE_SIZES */
  limit: Signal<number>
  /** Search text from ?q= */
  query: Signal<string>
  pageSizes: number[]
  goToPage: (page: number) => void
  setPageSize: (limit: number) => void
  /** Sets ?q= and goes back to page 1 */
  setQuery: (query: string) => void
}

/**
 * Table view state kept in the URL (?q=&page=&limit=) so reloads and back keep the place.
 * Call in an injection context (a component field).
 */
export function injectUrlPaging (pageSizes = PAGE_SIZES): UrlPaging {
  const route = inject(ActivatedRoute)
  const router = inject(Router)
  const params = toSignal(route.queryParamMap, { requireSync: true })

  const navigate = (queryParams: Record<string, string | number | null>): void => {
    void router.navigate([], { relativeTo: route, queryParams, queryParamsHandling: 'merge', replaceUrl: 'q' in queryParams })
  }

  const query = computed(() => params().get('q') ?? '')

  return {
    page: computed(() => Math.max(1, Number(params().get('page') ?? 1) || 1)),
    limit: computed(() => {
      const limit = Number(params().get('limit'))
      return pageSizes.includes(limit) ? limit : pageSizes[0]
    }),
    query,
    pageSizes,
    goToPage: page => { navigate({ page }) },
    setPageSize: limit => { navigate({ page: 1, limit }) },
    setQuery: text => {
      // Unchanged text (e.g. the box catching up after back) keeps the page
      if (text.trim() === query()) return
      navigate({ q: text.trim() !== '' ? text.trim() : null, page: 1 })
    }
  }
}
