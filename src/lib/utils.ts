// >>> Here purely bcos ts !understanding the type-guarding work that .filter(Boolean) does. Sigh...

// courtesy of lodash via stackoverflow.
type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export function truthify<T>(value: T): value is Truthy<T> {
  return !!value
}
// <<<
