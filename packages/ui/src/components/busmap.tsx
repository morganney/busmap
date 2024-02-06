import styled from 'styled-components'

import { Page } from './page.js'
import { PageTabButton } from './pageTabButton.js'

import type { FC } from 'react'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const BusmapPage: FC = () => {
  return (
    <Page title="Welcome">
      <p>
        Busmap provides real-time arrival and departure times for vehicles servicing bus
        stops along routes in{' '}
        <a href="https://www.sfmta.com/" target="_blank" rel="noreferrer">
          San Francisco Muni CIS
        </a>
        ,{' '}
        <a href="https://www.ttc.ca/" target="_blank" rel="noreferrer">
          Toronto Transit Commission
        </a>
        ,{' '}
        <a href="https://omnitrans.org/" target="_blank" rel="noreferrer">
          OmniTrans
        </a>
        , and other transit agencies across North and South America.
      </p>
      <Section>
        <h2>Finding Your Stop</h2>
        <p>
          To find your desired stop, you can start with the{' '}
          <PageTabButton page="select">Selector</PageTabButton> tab to find a transit
          agency, route, direction, and stop that fits your itinerary. Alternatively, you
          can use the <PageTabButton page="locate">Nearby</PageTabButton> tab where you
          will be prompted to share your device&apos;s geolocation with Busmap, and a list
          of the nearest stops will be displayed.
        </p>
        <p>
          From either option, you can favorite the stop by clicking the star ⭐ icon, and
          a bookmark will be added to the{' '}
          <PageTabButton page="favorites">Favorites</PageTabButton> tab.
        </p>
      </Section>
      <Section>
        <h2>About</h2>
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
      </Section>
    </Page>
  )
}

export { BusmapPage }
