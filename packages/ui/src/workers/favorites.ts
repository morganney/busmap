import type { Favorite } from '../contexts/storage.js'

interface FavoriteMessage {
  action: 'start' | 'stop' | 'close'
  favorite?: Favorite
}

addEventListener('message', (evt: MessageEvent<FavoriteMessage>) => {
  postMessage(`thanks for sending ${evt.data}`)

  if (evt.data.action === 'close') {
    postMessage(`Closing worker ${self.name}`)
    self.close()
  }
})

export type { FavoriteMessage }
