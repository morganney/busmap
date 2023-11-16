import styled from 'styled-components'
import { useCallback } from 'react'
import { Alert } from '@busmap/components/alert'

import type { FC } from 'react'

interface ErrorAgenciesProps {
  error: Error
}

const Wrap = styled.div`
  display: grid;
  gap: 16px;
  padding: 20px;

  button {
    padding: 6px;
    cursor: pointer;
  }
`
const ErrorAgencies: FC<ErrorAgenciesProps> = () => {
  const reload = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <Wrap>
      <Alert type="error">Error loading transit agencies.</Alert>
      <button onClick={reload}>Retry</button>
    </Wrap>
  )
}

export { ErrorAgencies }
