import type { FC } from 'react'

interface MinutesProps {
  affectedByLayover: boolean
  minutes: number
}

const Minutes: FC<MinutesProps> = ({ minutes, affectedByLayover }) => {
  return (
    <time dateTime={`PT${minutes}M`}>
      {minutes} min{affectedByLayover && <sup>*</sup>}
    </time>
  )
}

export { Minutes }
export type { MinutesProps }
