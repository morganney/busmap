import styled from 'styled-components'
import { useCallback, useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Star } from '@busmap/components/icons/star'
import { Tooltip } from '@busmap/components/tooltip'
import { toast } from '@busmap/components/toast'
import { SY30T } from '@busmap/components/colors'

import { useGlobals } from '@core/globals.js'
import { useStorage, useStorageDispatch } from '@core/contexts/storage.js'
import { same } from '@module/util.js'

import { MAX_FAVORITES } from '../common.js'
import { put } from '../api/put.js'
import { remove } from '../api/delete.js'

import type { FC } from 'react'
import type { RouteName, DirectionName } from '@core/types.js'
import type { Selection } from '@module/util.js'
import type { Favorite } from '@busmap/common/types/favorites'

interface SelectionMeta extends Selection {
  route: RouteName & {
    color: string
    textColor: string
    shortTitle?: string
  }
  direction: DirectionName & {
    shortTitle?: string
  }
}
interface FavoriteStopProps {
  size?: 'small' | 'medium'
  selection?: SelectionMeta
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
const FavoriteStop: FC<FavoriteStopProps> = ({ selection, size = 'medium' }) => {
  const globals = useGlobals()
  const { agency, route, direction, stop } = selection ?? globals
  const { user } = globals
  const { favorites } = useStorage()
  const storageDispatch = useStorageDispatch()
  const mutation = useMutation({
    mutationFn: (fav: Favorite) => put(fav)
  })
  const removal = useMutation({
    mutationFn: (fav: Favorite) => remove(fav)
  })
  const favorite = useMemo(() => {
    return favorites.find(fav => {
      if (route && direction && stop && agency) {
        return same(fav, { agency, route, direction, stop })
      }
    })
  }, [favorites, agency, stop, route, direction])
  const onClick = useCallback(async () => {
    if (favorite) {
      storageDispatch({ type: 'favoriteRemove', value: favorite })

      if (user) {
        try {
          await removal.mutateAsync(favorite)
          toast({ type: 'info', message: 'Favorite removed.' })
        } catch (err) {
          toast({ type: 'error', message: 'Error removing favorite.' })
        }
      }
    } else if (agency && route && direction && stop) {
      const add: Favorite = {
        stop: stop,
        agency: { id: agency.id, title: agency.title, region: agency.region },
        route: {
          id: route.id,
          title: route.title ?? route.shortTitle,
          color: route.color,
          textColor: route.textColor
        },
        direction: { id: direction.id, title: direction.title ?? direction.shortTitle }
      }

      storageDispatch({ type: 'favoriteAdd', value: add })

      if (user) {
        try {
          await mutation.mutateAsync(add)
          toast({ type: 'info', message: 'Favorite saved.' })
        } catch {
          toast({ type: 'error', message: 'Error saving favorite.' })
        }
      }
    }
  }, [storageDispatch, mutation, removal, agency, route, direction, stop, favorite, user])
  const isFavoritable = Boolean(stop) && (favorites.length < MAX_FAVORITES || favorite)

  if (isFavoritable) {
    return (
      <Tip title={favorite ? 'Remove favorite.' : 'Add favorite.'}>
        <Button>
          <Star size={size} color={SY30T} outlined={!favorite} onClick={onClick} />
        </Button>
      </Tip>
    )
  }

  return null
}

export { FavoriteStop }
