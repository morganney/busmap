import { useQuery } from 'react-query'
import { createPortal } from 'react-dom'

import { Agencies } from './components/agencies.js'

import type { ReactNode, FC } from 'react'

export interface HomeProps {
  children?: ReactNode
}
export const Home: FC<HomeProps> = () => {
  const { data, error } = useQuery('agencies', async () => {
    const resp = await fetch('/restbus/agencies')
    const json = await resp.json()

    return json
  })

  if (error) {
    if (error instanceof Error) {
      return <p>An unexpected error occured: {error.message}</p>
    }
  }

  if (data) {
    return (
      <>
        {createPortal(
          <Agencies agencies={data} />,
          document.querySelector('body > aside') as HTMLElement
        )}
      </>
    )
  }

  return <>Loading...</>
}
