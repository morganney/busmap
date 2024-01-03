import { Loading } from '@busmap/components/loading'
import { PB90T, PB20T } from '@busmap/components/colors'

import { useTheme } from '@module/settings/contexts/theme.js'

const Dots = () => {
  const { mode } = useTheme()

  return <Loading indent={2} color={mode === 'dark' ? PB90T : PB20T} />
}

export { Dots }
