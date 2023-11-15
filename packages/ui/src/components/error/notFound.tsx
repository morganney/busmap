import styled from 'styled-components'

import { FavoritesList } from './favoriteList.js'

import type { FC } from 'react'

const Wrap = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
`
const Grid = styled.div`
  display: grid;
  grid-template-rows: max-content max-content;
  gap: 8px;
  min-width: 260px;

  h2 {
    margin: 0;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid black;
    line-height: 1;

    span:last-child {
      font-size: 18px;
      font-weight: normal;
    }
  }

  p {
    margin: 28px 0;
  }
`
const NotFound: FC = () => {
  return (
    <Wrap>
      <Grid>
        <h2>
          <span>404</span>
          <span>Not found</span>
        </h2>
        <p>What you are looking for does not exist here.</p>
        <FavoritesList />
      </Grid>
    </Wrap>
  )
}

export { NotFound }
