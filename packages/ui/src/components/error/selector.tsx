import styled from 'styled-components'
import { Alert } from '@busmap/components/alert'

import { errors } from '@core/api/errors.js'

import type { FC } from 'react'

interface SelectorErrorProps {
  err: Error
}

const Text = styled.p`
  && {
    margin: 0 0 10px;
  }
`
const SelectorError: FC<SelectorErrorProps> = ({ err }) => {
  const message = errors.getMessage(err)

  return (
    <Alert type="error">
      <Text>An error occured while getting agency and route information:</Text>
      <Text>{message}</Text>
    </Alert>
  )
}

export { SelectorError }
