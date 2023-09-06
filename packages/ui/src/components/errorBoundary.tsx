import { Component } from 'react'

import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}
interface State {
  hasError: boolean
  error?: Error
}

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
    if (this.state.hasError) {
      return (
        <div>
          <p>Oops!: {this.state.error?.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
