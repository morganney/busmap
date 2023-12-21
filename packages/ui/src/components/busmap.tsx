import { Page } from './page.js'

import type { FC } from 'react'

const BusmapPage: FC = () => {
  return (
    <Page title="About">
      <p>
        Busmap is a public, open source project{' '}
        <a href="https://github.com/morganney/busmap" target="_blank" rel="noreferrer">
          hosted on GitHub
        </a>{' '}
        and powered by the{' '}
        <a
          href="https://retro.umoiq.com/xmlFeedDocs/NextBusXMLFeed.pdf"
          target="_blank"
          rel="noreferrer">
          UMO public XML feed
        </a>{' '}
        and{' '}
        <a href="http://restbus.info/" target="_blank" rel="noreferrer">
          <code>restbus</code>
        </a>
        .
      </p>
      <p>
        <a
          href="https://github.com/morganney/busmap/pulls"
          target="_blank"
          rel="noreferrer">
          Contributions
        </a>{' '}
        and{' '}
        <a
          href="https://github.com/morganney/busmap/discussions"
          target="_blank"
          rel="noreferrer">
          feedback
        </a>{' '}
        are welcome. You can also report any{' '}
        <a
          href="https://github.com/morganney/busmap/issues"
          target="_blank"
          rel="noreferrer">
          issues or bugs
        </a>
        . Maintained with ❤️ by{' '}
        <a href="https://github.com/morganney" target="_blank" rel="noreferrer">
          morganney
        </a>
        .
      </p>
    </Page>
  )
}

export { BusmapPage }
