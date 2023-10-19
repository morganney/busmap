import styled from 'styled-components'

import circleSvg from '../../assets/svg/circled.svg'

import type { FC } from 'react'

const color = 'rgb(180, 154, 54)'
const List = styled.div`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
    <List>
      <figure>
        <svg viewBox="0 0 30 12" width="30px" height="12px">
          <rect width="30" height="12" fill={color} />
        </svg>
        <figcaption>A route plotted by its paths and associated color.</figcaption>
      </figure>
      <figure>
        <img src={circleSvg} alt="stop marker icon" height="12px" />
        <figcaption>
          A stop on a route. Click or tap to obtain real-time arrival predictions.
        </figcaption>
      </figure>
      <figure>
        <OtsVehicle />
        <figcaption>
          An unpredictable vehicle. Either out of service, or no GPS signal.
        </figcaption>
      </figure>
      <figure>
        <RouteVehicle>
          <span>A</span>
          <span>➞</span>
        </RouteVehicle>
        <figcaption>
          A vehicle labeled by route name and heading. Click or tap to get more details.
        </figcaption>
      </figure>
    </List>
  )
}

export { Info }
