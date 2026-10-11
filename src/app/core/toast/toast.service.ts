import { Injectable, signal } from '@angular/core'

export type ToastTone = 'success' | 'danger' | 'info'

export interface Toast {
  id: number
  tone: ToastTone
  title: string
  message?: string
}

const DURATION_MS = 5000

/** Short, non-blocking messages shown by <cs-toast-host> (mounted once in the app root). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0
  private readonly items = signal<Toast[]>([])
  readonly toasts = this.items.asReadonly()

  success (title: string, message?: string): void { this.show('success', title, message) }
  error (title: string, message?: string): void { this.show('danger', title, message) }
  info (title: string, message?: string): void { this.show('info', title, message) }

  dismiss (id: number): void {
    this.items.update(list => list.filter(toast => toast.id !== id))
  }

  private show (tone: ToastTone, title: string, message?: string): void {
    const id = ++this.nextId
    // Keep the stack short; the same error repeated by parallel requests shows once
    this.items.update(list => [
      ...list.filter(toast => toast.title !== title || toast.message !== message).slice(-2),
      { id, tone, title, message }
    ])
    setTimeout(() => { this.dismiss(id) }, DURATION_MS)
  }
}
