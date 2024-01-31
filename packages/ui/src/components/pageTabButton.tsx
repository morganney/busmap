import styled from 'styled-components'
import { useCallback } from 'react'
import { PB20T, PB90T } from '@busmap/components/colors'

import { useGlobals } from '@core/globals.js'
import { isAPage } from '@module/util.js'
import { useTheme } from '@module/settings/contexts/theme.js'

import type { ReactNode, FC, MouseEvent } from 'react'
import type { Page } from '@core/types'
import type { Mode } from '@busmap/common/types/settings'

interface PageTabButtonProps {
  children: ReactNode
  page: Page
}
const Button = styled.button<{ $mode: Mode }>`
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $mode }) => ($mode === 'light' ? PB20T : PB90T)};
  font-weight: 700;
  font-size: 1.6rem;
`
const PageTabButton: FC<PageTabButtonProps> = ({ children, page }) => {
  const { dispatch } = useGlobals()
  const { mode } = useTheme()
  const onClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const tab = evt.currentTarget.dataset.tab

      if (isAPage(tab)) {
        dispatch({ type: 'page', value: tab })
        dispatch({ type: 'collapsed', value: false })
      }
    },
    [dispatch]
  )

  return (
    <Button $mode={mode} onClick={onClick} data-tab={page}>
      {children}
    </Button>
  )
}

export { PageTabButton }
