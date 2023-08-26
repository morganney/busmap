import type { FC } from 'react'

interface Props {
  agencies: { region: string; title: string; id: string }[]
}
const Agencies: FC<Props> = ({ agencies }) => {
  return agencies.map(agency => (
    <dl key={agency.id}>
      <dt>Region</dt>
      <dd>{agency.region}</dd>
      <dt>Title</dt>
      <dd>{agency.title}</dd>
      <dt>ID</dt>
      <dd>{agency.id}</dd>
    </dl>
  ))
}

export { Agencies }
