import { useCallback, useState } from 'react'
import { AutoSuggest } from '@busmap/components/autoSuggest'

import type { FC } from 'react'
import type { AnItem } from '@busmap/components/autoSuggest'

interface Props {
  agencies: { region: string; title: string; id: string }[]
}
const Agencies: FC<Props> = ({ agencies }) => {
  const [selection, setSelection] = useState('')
  const onSelect = useCallback((selected: AnItem) => {
    setSelection(typeof selected === 'string' ? selected : selected.value)
  }, [])
  const items = agencies.map(({ title, id }) => ({ label: title, value: id }))

  return (
    <>
      <p>Selection: {selection || 'n/a'}</p>
      <AutoSuggest
        onClear
        caseInsensitive
        inputBoundByItems
        placeholder="Select a transit agency"
        items={items}
        onSelect={onSelect}
      />
    </>
  )
}

export { Agencies }
