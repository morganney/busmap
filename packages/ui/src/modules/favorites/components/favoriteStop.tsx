import styled from 'styled-components'
import { useCallback, useMemo } from 'react'
import { Star } from '@busmap/components/icons/star'
import { Tooltip } from '@busmap/components/tooltip'
import { SY30T } from '@busmap/components/colors'

import { useGlobals } from '../../../globals.js'
import { useStorage, useStorageDispatch } from '../../../contexts/storage.js'
import { same } from '../util.js'

import type { FC } from 'react'
import type { Favorite } from '../types.js'

const Tip = styled(Tooltip)`
  display: flex;
`
const Button = styled.button`
  border: none;
  padding: 0;
  margin: 0;
  background: none;
`
const FavoriteStop: FC = () => {
  const storage = useStorage()
  const storageDispatch = useStorageDispatch()
  const { agency, route, direction, stop } = useGlobals()
  const favorite = useMemo(() => {
    return storage.favorites?.find(fav => {
      if (route && direction && stop && agency) {
        return same(fav, { agency, route, direction, stop })
      }
    })
  }, [storage.favorites, agency, stop, route, direction])
  const onClick = useCallback(() => {
    if (favorite) {
      storageDispatch({ type: 'favoriteRemove', value: favorite })
    } else if (agency && route && direction && stop) {
      const add: Favorite = {
        stop: stop,
        agency: { id: agency.id, title: agency.title, region: agency.region },
        route: { id: route.id, title: route.title ?? route.shortTitle },
        direction: { id: direction.id, title: direction.title ?? direction.shortTitle }
      }

      storageDispatch({ type: 'favoriteAdd', value: add })
    }
  }, [storageDispatch, agency, route, direction, stop, favorite])

  if (stop) {
    return (
      <Tip title={favorite ? 'Remove favorite.' : 'Add favorite.'}>
        <Button>
          <Star size="small" color={SY30T} outlined={!favorite} onClick={onClick} />
        </Button>
      </Tip>
    )
  }

  return null
}

export { FavoriteStop }