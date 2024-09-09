import React from 'react'

import { useLayoutEffect } from 'react'

// Returns the same function without worrying about stale deps
export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const callbackRef = React.useRef(callback)

  useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return React.useCallback(
    (...args: any[]) => callbackRef.current(...args),
    [],
  ) as T
}
