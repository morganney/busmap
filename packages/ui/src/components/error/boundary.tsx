import styled from 'styled-components'
import { Component } from 'react'
import { PB97T, PB30T } from '@busmap/components/colors'

import { FavoritesList } from './favoriteList.js'

import type { ReactNode } from 'react'

/**
 * Right now RR DOES NOT allow errors to
 * bubble up outside of <RouterProvider />
 * allowing a global error handler to be defined.
 *
 * To mitigate against that somewhat, this React
 * error boundary will accept errors from the derived
 * state, and as a prop.
 *
 * This can be simplified once RR stops enforcing error
 * handling logic on its users.
 *
 * @see https://github.com/remix-run/react-router/issues/10257
 * @see https://github.com/remix-run/react-router/discussions/10166
 */
interface ErrorBoundaryProps {
  children?: ReactNode
  error?: Error
}
interface State {
  hasError: boolean
  error?: Error
}

const Wrap = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
`
const Grid = styled.div`
  display: grid;
  gap: 20px;
  font-size: 16px;
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
    margin: 0;
    padding: 0;
    line-height: 1.25;
  }

  code {
    padding: 30px;
    border-radius: 5px;
    background: ${PB30T};
    color: ${PB97T};
  }
`
class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false
    }
  }
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    }
  }

  render() {
    if (this.state.error || this.props.error) {
      const err = this.state.error ?? this.props.error
      const msg = err?.message ?? 'An unknown error occured.'

      document.body.classList.add('busmap-error')

      return (
        <Wrap>
          <Grid>
            <h2>
              <span>Oops!</span>
              <span>Something broke</span>
            </h2>
            <p>
              My wife says this page isn&apos;t necessary because I should just build the
              app right, but here you are nevertheless.
            </p>
            <p>
              Something is broken. You can <a href="/">click here</a> to recover from the
              error.
            </p>
            <code>{msg}</code>
          </Grid>
          <FavoritesList />
        </Wrap>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
