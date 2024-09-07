import camelcaseKeys from 'camelcase-keys'
import decamelizeKeys from 'decamelize-keys'

export function camelize<T extends Record<string, any>>(
  input: Record<string, any>,
): T {
  const output = camelcaseKeys(input, { deep: true }) as T

  return output
}

export function decamelize(input: Record<string, any>): Record<string, any> {
  const output = decamelizeKeys(input, { deep: true }) as Record<string, any>

  return output
}
