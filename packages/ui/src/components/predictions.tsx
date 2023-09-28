import styled, { keyframes } from 'styled-components'

import type { FC } from 'react'
import type { Pred } from '../types.js'

interface PredictionsProps {
  preds: Pred[]
  direction: string
}

const blink = keyframes`
  10% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  40% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`
const Direction = styled.p`
  margin: 20px 0;
`
const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;

  li {
    padding: 12px 10px;
    border-bottom: 1px solid black;
  }

  li:last-child {
    border-bottom: none;
  }

  em {
    font-style: normal;
    opacity: 1;
    animation: ${blink} 1.5s linear infinite;
  }
`
const Predictions: FC<PredictionsProps> = ({ preds, direction }) => {
  return (
    <>
      <Direction>Arrivals: {direction ?? 'Direction not available'}</Direction>
      <List>
        {preds.map(({ minutes, epochTime }) => (
          <li key={epochTime}>
            {minutes === 0 ? (
              <em key={epochTime}>Arriving</em>
            ) : (
              <time key={epochTime} dateTime={`PT${minutes}M`}>
                {minutes} min
              </time>
            )}
          </li>
        ))}
      </List>
    </>
  )
}

export { Predictions }
