import styled from 'styled-components'
import { useCallback, useMemo } from 'react'
import { Star } from '@busmap/components/icons/star'
import { Tooltip } from '@busmap/components/tooltip'
import { SY30T } from '@busmap/components/colors'

import { useGlobals } from '../globals.js'
import { useStorage, useStorageDispatch } from '../contexts/storage.js'

import type { FC } from 'react'
import type { Favorite } from '../contexts/storage.js'

const Tip = styled(Tooltip)`
  display: flex;
`
const Button = styled.button`
  border: none;
  padding: 0;
  margin: 0;
  background: none;
`
const worker = new Worker(new URL('../workers/favorites.ts', import.meta.url), {
  type: 'module'
})
const FavoriteStop: FC = () => {
  const storage = useStorage()
  const storageDispatch = useStorageDispatch()
  const { agency, route, direction, stop } = useGlobals()
  const favorite = useMemo(() => {
    return storage.favorites?.find(fav => {
      return (
        `${fav.route.id}${fav.direction.id}${fav.stop.id}` ===
        `${route?.id}${direction?.id}${stop?.id}`
      )
    })
  }, [storage.favorites, stop, route, direction])
  const onClick = useCallback(() => {
    if (favorite) {
      storageDispatch({ type: 'favoriteRemove', value: favorite })
      worker.postMessage({ action: 'stop', favorite })
    } else if (agency && route && direction && stop) {
      const add: Favorite = {
        stop: stop,
        agency: agency,
        route: { id: route.id, title: route.title ?? route.shortTitle },
        direction: { id: direction.id, title: direction.title ?? direction.shortTitle }
      }

      storageDispatch({ type: 'favoriteAdd', value: add })
      worker.postMessage({ action: 'start', favorite: add })
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
