import { useStorage } from '../../../contexts/storage.js'

import type { FC } from 'react'

const Favorites: FC = () => {
  const { favorites } = useStorage()

  if (!favorites || !favorites.length) {
    return <div>⭐ You can select your favorite stops from the bus selector tab. ⭐</div>
  }

  return favorites.map(fav => <p key={fav.stop.id}>{fav.stop.title}</p>)
}

export { Favorites }
