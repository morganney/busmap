import styled from 'styled-components'
import { Star } from '@busmap/components/icons/star'
import { Tooltip } from '@busmap/components/tooltip'
import { SY30T } from '@busmap/components/colors'

import type { FC } from 'react'
import type { Stop } from '../types.js'

interface FavoriteStopProps {
  stop?: Stop
  favorite: boolean
}

const Tip = styled(Tooltip)`
  display: flex;
`
const Button = styled.button`
  border: none;
  padding: 0;
  margin: 0;
  background: none;
`
const FavoriteStop: FC<FavoriteStopProps> = ({ stop, favorite = false }) => {
  if (stop) {
    return (
      <Tip title={favorite ? 'Favorite stop.' : 'Add to favorites.'}>
        <Button>
          <Star size="small" color={SY30T} outlined={!favorite} />
        </Button>
      </Tip>
    )
  }

  return null
}

export { FavoriteStop }
