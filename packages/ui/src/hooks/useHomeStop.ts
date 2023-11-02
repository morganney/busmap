import { useMatches } from 'react-router-dom'

const useHomeStop = () => {
  const matches = useMatches()
  const homeStop = matches.find(({ id }) => id === 'home-stop')

  return homeStop
}

export { useHomeStop }
