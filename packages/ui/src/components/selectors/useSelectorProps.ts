import { useMemo } from 'react'
import { DARK_MODE_FIELD, PB90T } from '@busmap/components/colors'

import { useTheme } from '@module/settings/contexts/theme.js'

import type { AutoSuggestProps } from '@busmap/components/autoSuggest'

interface SelectorProps<T> {
  selected?: T
}
interface SelectorSpreadProps<T> {
  onClear: AutoSuggestProps<T>['onClear']
  inputBoundByItems: boolean
  size: AutoSuggestProps<T>['size']
  color: AutoSuggestProps<T>['color']
  value: AutoSuggestProps<T>['value']
  selectOnTextMatch: AutoSuggestProps<T>['selectOnTextMatch']
  caseInsensitive: AutoSuggestProps<T>['caseInsensitive']
}

const useSelectorProps = <T>({ selected }: SelectorProps<T>): SelectorSpreadProps<T> => {
  const { mode } = useTheme()
  const isLightMode = mode === 'light'
  const props = useMemo(
    () => ({
      onClear: true,
      caseInsensitive: false,
      inputBoundByItems: true,
      selectOnTextMatch: true,
      size: 'small' as AutoSuggestProps<T>['size'],
      color: isLightMode ? 'black' : PB90T,
      value: selected ?? undefined,
      background: isLightMode ? 'white' : DARK_MODE_FIELD
    }),
    [selected, isLightMode]
  )

  return props
}

export { useSelectorProps }
export type { SelectorProps }
