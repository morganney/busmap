import { useRef, useEffect } from 'react'

const usePrevious = <T>(value: T) => {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export { usePrevious }
