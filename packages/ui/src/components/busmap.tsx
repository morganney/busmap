import { Page } from './page.js'

import type { FC } from 'react'

const BusmapPage: FC = () => {
  return (
    <Page title="About">
      <p>
        Busmap provides real-time arrival and departure times for vehicles servicing bus
        stops along routes in San Francisco Muni CIS, Toronto Transit Commission,
        OmniTrans, and other transit agencies across North and South America.
      </p>
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
        .{' '}
        <a
          href="https://github.com/morganney/busmap/pulls"
          target="_blank"
          rel="noreferrer">
          Pull requests
        </a>
        ,{' '}
        <a
          href="https://github.com/morganney/busmap/discussions"
          target="_blank"
          rel="noreferrer">
          feedback
        </a>{' '}
        and{' '}
        <a
          href="https://github.com/morganney/busmap/issues"
          target="_blank"
          rel="noreferrer">
          issues or bugs
        </a>{' '}
        are welcome.
      </p>
      <p>
        Maintained with ❤️ by{' '}
        <a href="https://github.com/morganney" target="_blank" rel="noreferrer">
          morganney
        </a>
      </p>
    </Page>
  )
}

export { BusmapPage }
