import type { FC } from 'react'

interface TimeProps {
  epochTime: number
  affectedByLayover: boolean
  minutes: number
}

const Time: FC<TimeProps> = ({ epochTime, affectedByLayover }) => {
  const date = new Date(epochTime)
  const dateTime = date.toISOString()
  const time = date.toLocaleTimeString([], { timeStyle: 'short' })

  return (
    <time dateTime={dateTime}>
      {time}
      {affectedByLayover && <sup>*</sup>}
    </time>
  )
}

export { Time }
export type { TimeProps }
