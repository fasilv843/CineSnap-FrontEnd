import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core'
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged, map, skip } from 'rxjs'
import { IconComponent } from './icon.component'

/** Search box that reports what was typed after a short pause: <cs-search-field [value]="q()" (search)="setQuery($event)" /> */
@Component({
  selector: 'cs-search-field',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <label class="relative block">
      <span class="sr-only">{{ label() }}</span>
      <cs-icon name="search" class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-subtle" />
      <input type="search" class="input pl-10" [placeholder]="placeholder()" autocomplete="off"
        [value]="text()" (input)="text.set($any($event.target).value)" />
    </label>
  `
})
export class SearchFieldComponent {
  /** Current search, usually from the URL; the box follows it (e.g. on back) */
  readonly value = input('')
  readonly label = input('Search')
  readonly placeholder = input('Search')

  protected readonly text = linkedSignal(() => this.value())

  readonly search = outputFromObservable(toObservable(this.text).pipe(
    skip(1), // the initial value isn't a search
    map(text => text.trim()),
    debounceTime(350),
    distinctUntilChanged()
  ))
}
