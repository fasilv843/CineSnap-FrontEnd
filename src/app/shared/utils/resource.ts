import { type Resource } from '@angular/core'

/**
 * A resource's value, or undefined while it has none (loading for the first time, or failed).
 * resource.value() throws while the resource is in its error state, so computeds and linkedSignals read through this
 * and the template shows the error panel instead of breaking.
 */
export function valueOf<T> (resource: Resource<T>): T | undefined {
  return resource.hasValue() ? resource.value() : undefined
}
