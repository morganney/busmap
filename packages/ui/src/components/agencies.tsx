import { useCallback, useState } from 'react'
import { AutoSuggest } from '@busmap/components'
import type { ChangeEvent, FC } from 'react'

interface Props {
  agencies: { region: string; title: string; id: string }[]
}
const Agencies: FC<Props> = ({ agencies }) => {
  const [selection, setSelection] = useState('')
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setSelection(evt.target.value)
  }, [])

  return (
    <>
      <p>Selection: {selection || 'n/a'}</p>
      <AutoSuggest
        inputBoundByItems
        placeholder="Select a transit agency"
        items={agencies.map(agency => agency.title)}
        onChange={onChange}
      />
    </>
  )
}

export { Agencies }
