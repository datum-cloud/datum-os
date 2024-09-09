export function sortAlphabetically(
  a: string,
  b: string,
  options?: Intl.CollatorOptions,
) {
  return a.localeCompare(b, undefined, options || { sensitivity: 'base' })
}
