/* eslint-disable @typescript-eslint/ban-types */

// Not working :(
export const debounce = (
  fn: (...params: any[]) => any,
  n: number = 3000,
  immed: boolean = false
): ((...args: any[]) => any) => {
  let timer: any | undefined

  return function (this: any, ...args: any[]): any {
    if (timer === undefined && immed) {
      fn.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), n)
    return timer
  }
}
