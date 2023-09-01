import { useQuery } from 'react-query'
import { createPortal } from 'react-dom'
import type { FC, ReactNode } from 'react'
import { Input } from '@busmap/components'

import { Agencies } from './components/agencies.js'

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { data, error } = useQuery('agencies', async () => {
    const resp = await fetch('/restbus/agencies')
    const json = await resp.json()

    return json
  })

  if (error) {
    if (error instanceof Error) {
      return <Input value={error.message} />
    }
  }

  if (data) {
    return (
      <>
        {createPortal(
          <Agencies agencies={data} />,
          document.querySelector('body > aside') as HTMLElement,
        )}
        {children}
      </>
    )
  }

  return <>Loading...</>
}
