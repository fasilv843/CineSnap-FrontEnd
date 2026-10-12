import { Injectable, computed, inject, signal } from '@angular/core'
import { environments } from 'src/environments/environment'
import { ToastService } from '../toast/toast.service'

/** timeout: no answer within GIVE_UP_AFTER_MS, so polling stopped until retry() */
export type ServerStatus = 'checking' | 'waking' | 'timeout' | 'ready'

const ESTIMATE_KEY = 'cs-cold-start-ms'
const DISMISSED_KEY = 'cs-wake-dismissed'
const DEFAULT_ESTIMATE_MS = 50_000
const WARM_TIMEOUT_MS = 1500
const POLL_EVERY_MS = 3000
const POLL_TIMEOUT_MS = 10_000
const GIVE_UP_AFTER_MS = 90_000
const TICK_MS = 250

function readEstimate (): number {
  try {
    const saved = Number(localStorage.getItem(ESTIMATE_KEY))
    if (saved > 0) return saved
  } catch {}
  return DEFAULT_ESTIMATE_MS
}

function readDismissed (): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

/** Resolves true when /health answers OK within the timeout. Uses fetch so the HttpClient interceptors (and their error toasts) stay out of it. */
async function ping (timeoutMs: number): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => { controller.abort() }, timeoutMs)
  try {
    const res = await fetch(`${environments.baseUrl}health`, { signal: controller.signal, cache: 'no-store' })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/**
 * The server is on a free hosting service, which sleeps when idle and takes a while to start.
 * Detects that at boot and tracks an estimated wake-up progress for <app-server-wake>.
 */
@Injectable({ providedIn: 'root' })
export class ServerStatusService {
  private readonly toast = inject(ToastService)

  readonly status = signal<ServerStatus>('checking')
  readonly elapsedMs = signal(0)
  readonly dismissed = signal(readDismissed())
  private readonly estimateMs = readEstimate()
  private readonly complete = signal(false)

  /** Eased so it reaches ~90% at the estimate and never sits at 100% while still waiting */
  readonly progress = computed(() => this.complete()
    ? 100
    : 95 * (1 - Math.exp(-this.elapsedMs() / (this.estimateMs / 2.2))))

  private started = false
  private tick?: ReturnType<typeof setInterval>

  start (): void {
    if (this.started) return
    this.started = true
    void this.run()
  }

  dismiss (): void {
    this.dismissed.set(true)
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1')
    } catch {}
  }

  /** Starts another round of checks after the previous one gave up */
  retry (): void {
    if (this.status() === 'timeout') void this.wait()
  }

  private async run (): Promise<void> {
    if (await ping(WARM_TIMEOUT_MS)) {
      this.status.set('ready')
      return
    }
    await this.wait()
  }

  /** Polls /health until it answers or GIVE_UP_AFTER_MS passes, then stops making requests */
  private async wait (): Promise<void> {
    const startedAt = Date.now()
    const elapsed = (): number => Date.now() - startedAt
    this.elapsedMs.set(0)
    this.status.set('waking')
    this.tick = setInterval(() => { this.elapsedMs.set(elapsed()) }, TICK_MS)

    // One request in flight at a time; a failure just means try again
    let up = false
    while (true) {
      up = await ping(Math.min(POLL_TIMEOUT_MS, GIVE_UP_AFTER_MS - elapsed()))
      if (up || elapsed() + POLL_EVERY_MS >= GIVE_UP_AFTER_MS) break
      await new Promise(resolve => setTimeout(resolve, POLL_EVERY_MS))
    }

    clearInterval(this.tick)
    if (!up) {
      this.status.set('timeout')
      return
    }

    const measured = elapsed()
    this.elapsedMs.set(measured)
    // Let the bar visibly fill before the overlay goes away
    this.complete.set(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    this.status.set('ready')
    try {
      localStorage.setItem(ESTIMATE_KEY, String(Math.min(120_000, Math.max(20_000, measured))))
    } catch {}
    if (this.dismissed()) this.toast.info('Server is awake', 'Reload the page to load live data.')
  }
}
