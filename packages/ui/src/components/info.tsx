import styled from 'styled-components'

import { Page } from './page.js'

import circleSvg from '../../assets/svg/circled.svg'

import type { FC } from 'react'

const color = 'rgb(180, 154, 54)'
const List = styled.div`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;

  figure {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-start;
    gap: 15px;

    > *:first-child {
      min-width: 30px;
    }
  }

  figcaption {
    line-height: 1.25;
    position: relative;
    margin-top: -3px;
  }
`
const OtsVehicle = styled.span`
  width: 30px;
  height: 12px;
  border: 1px solid black;
  background: repeating-linear-gradient(
    45deg,
    ${color},
    ${color} 5px,
    black 5px,
    black 10px
  );
`
const RouteVehicle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 3px;
  border: 1px solid black;
  background: ${color};

  span {
    color: black;
    font-size: 10px;
  }

  span:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-45deg);
  }
`
const Info: FC = () => {
  return (
    <Page title="Map Info">
      <List>
        <figure>
          <svg viewBox="0 0 30 6" width="30px" height="6px">
            <rect width="30" height="6" fill={color} />
          </svg>
          <figcaption>Route plotted by its color.</figcaption>
        </figure>
        <figure>
          <img src={circleSvg} alt="stop marker icon" height="12px" />
          <figcaption>
            Route stop. Click or tap to get real-time arrival predictions.
          </figcaption>
        </figure>
        <figure>
          <RouteVehicle>
            <span>A</span>
            <span>➞</span>
          </RouteVehicle>
          <figcaption>
            Vehicle labeled by route name and heading. Click or tap to get more details.
          </figcaption>
        </figure>
        <figure>
          <OtsVehicle />
          <figcaption>
            Unpredictable vehicle, possibly out of service or lost GPS signal. The heading
            may be incorrect.
          </figcaption>
        </figure>
      </List>
    </Page>
  )
}

export { Info }
