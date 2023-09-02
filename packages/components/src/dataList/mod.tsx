import { useMemo, useState, useRef, useEffect } from 'react'
import debounce from 'lodash.debounce'

import type { FC, ChangeEvent } from 'react'

import { Input } from '../input/mod.js'

interface DataListProps {
  value?: string
  placeholder?: string
  loadOptions?: (query: string) => Promise<string[]>
  items: string[]
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
}

const DataList: FC<DataListProps> = ({
  value,
  items,
  placeholder,
  loadOptions,
  onChange,
  onBlur,
}) => {
  const [options, setOptions] = useState(items || [])
  const loadOptionsRef = useRef(
    debounce(
      async evt => {
        const newOptions =
          typeof loadOptions === 'function'
            ? await loadOptions(evt.target.value?.trim())
            : options
        setOptions(newOptions)
      },
      250,
      { leading: true },
    ),
  )
  const [listId] = useMemo(() => {
    const randomValues = Array.from(window.crypto.getRandomValues(new Uint32Array(1)))

    return randomValues.map(val => val.toString(36))
  }, [])

  useEffect(() => {
    const loadOptsRef = loadOptionsRef.current

    return () => {
      loadOptsRef?.cancel()
    }
  }, [loadOptionsRef])

  return (
    <>
      <Input
        type="text"
        list={listId}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={loadOptionsRef.current}
      />
      <datalist id={listId}>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </datalist>
    </>
  )
}

export type { DataListProps }
export { DataList }
