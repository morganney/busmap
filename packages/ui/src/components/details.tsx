import styled from 'styled-components'
import { PB50T, PB80T } from '@busmap/components/colors'

import type { Mode } from '@module/settings/types.js'

const Details = styled.details<{ mode: Mode; color?: string }>`
  display: inline-block;
  margin: 0 0 12px;

  summary:first-of-type {
    font-size: 12px;
    cursor: pointer;
    color: ${({ color }) => color ?? 'inherit'};
  }

  p {
    line-height: 1.25;
    margin: 12px 0;
    padding: 12px;
    font-size: 14px;
    background: ${({ mode }) => (mode === 'light' ? 'white' : PB50T)};
    border-radius: 4px;
    border: 1px solid ${PB80T};
  }
`

export { Details }
