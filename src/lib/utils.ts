// >>> Here purely bcos ts !understanding the type-guarding work that .filter(Boolean) does. Sigh...

// courtesy of lodash via stackoverflow.
type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export function truthify<T>(value: T): value is Truthy<T> {
  return !!value
}
// <<<

/** 500ms debouncer for UI updates */
export function debounced(fnToDebounce: any) {
  let timer: number

  return function () {
    // @ts-ignore
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => fnToDebounce.apply(context, args), 500)
  }
}
