import { MAX_FAVORITES } from '@module/favorites/common.js'

import { Page } from './page.js'

import type { FC } from 'react'

const SignIn: FC = () => {
  return (
    <Page title="Sign In">
      <p>
        Sign in to save your favorite stops and settings across devices. After signing in,
        you can <strong>save more than {MAX_FAVORITES} favorite stops</strong>.
      </p>
    </Page>
  )
}

export { SignIn }
