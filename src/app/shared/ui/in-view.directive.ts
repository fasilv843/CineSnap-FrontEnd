import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core'

/** Emits each time the host element scrolls into the viewport, e.g. to load the next page of a list. */
@Directive({ selector: '[csInView]' })
export class InViewDirective {
  readonly csInView = output<void>()

  constructor () {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) this.csInView.emit()
    }, { rootMargin: '400px 0px' })
    observer.observe(inject(ElementRef<HTMLElement>).nativeElement)
    inject(DestroyRef).onDestroy(() => { observer.disconnect() })
  }
}
