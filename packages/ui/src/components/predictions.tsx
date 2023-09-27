import styled from 'styled-components'

import type { FC } from 'react'
import type { Pred } from '../types.js'

interface PredictionsProps {
  preds: Pred[]
}

const List = styled.ul`
  margin: 20px 0;
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
`
const Predictions: FC<PredictionsProps> = ({ preds }) => {
  return (
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
  )
}

export { Predictions }
