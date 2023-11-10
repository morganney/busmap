import styled from 'styled-components'
import { PB80T, PB20T, PB10T } from '@busmap/components/colors'

import { blinkStyles } from '@core/common.js'

import type { Mode } from './settings/types'

const AgenciesWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const AgencySection = styled.section<{ mode: Mode }>`
  border: 2px solid ${PB80T};
  border-radius: 5px;

  h3 {
    font-size: 14px;
    font-style: italic;
    margin: 0;
    padding: 2px 3px;
    line-height: 1;
    background: ${PB80T};
    color: ${({ mode }) => (mode === 'light' ? PB20T : PB10T)};
  }
`
const RouteWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 3px;
`
const RouteSection = styled.section<{ routeColor: string; routeTextColor: string }>`
  border-radius: 5px;
  border: 1px solid ${({ routeColor }) => routeColor};

  h4 {
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    padding: 2px 3px;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ routeTextColor }) => routeTextColor};
    background: ${({ routeColor }) => routeColor};
  }
`
const StopArticle = styled.article<{ routeColor: string; mode: Mode }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px dashed ${({ routeColor }) => routeColor};

  &:last-child {
    border-bottom: none;
  }

  footer {
    > div {
      display: inline-block;
    }
  }

  header {
    > div {
      display: inline-block;
    }

    h5 {
      font-size: 16px;
      margin: 0;

      a {
        color: ${({ routeColor }) => routeColor};
      }
    }

    h6 {
      font-size: 12px;
      font-weight: normal;
      margin: 0;
    }
  }

  &.selected {
    header {
      > div {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      h5 {
        a {
          text-decoration: none;

          &,
          svg {
            cursor: auto;
          }
        }
      }
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 6px;
    line-height: 1;

    li {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      font-weight: bold;

      em {
        ${blinkStyles};
      }
    }

    li:last-child {
      span:last-child {
        display: none;
      }
    }
  }
`

export { AgenciesWrap, AgencySection, RouteWrap, RouteSection, StopArticle }
