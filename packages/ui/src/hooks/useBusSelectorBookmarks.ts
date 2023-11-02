import { useRef } from 'react'
import { useMatches } from 'react-router-dom'

const useBusSelectorBookmark = () => {
  const matches = useMatches()
  const bookmark = useRef<Record<string, string | undefined> | undefined>()

  if (!bookmark.current) {
    const homeStop = matches.find(match => match.id === 'home-stop')

    bookmark.current = { ...homeStop?.params }
  }

  return bookmark.current
}

export { useBusSelectorBookmark }
