import { css, keyframes } from 'styled-components'
import { SG, SY, SLR10T } from '@busmap/components/colors'

export const PredictedVehiclesColors = {
  green: SG,
  yellow: SY,
  red: SLR10T
}
export const blink = keyframes`
  10% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  40% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`
export const blinkStyles = css`
  font-style: normal;
  opacity: 1;
  animation: ${blink} 1.5s linear infinite;
`
