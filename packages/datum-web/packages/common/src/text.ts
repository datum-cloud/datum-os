export { default as pluralize } from 'pluralize'

export function capitalizeFirstLetter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}
