## Development

Development is done using Docker and Compose.

Quick start:

1. `docker compose build`
2. `docke compose up dev`

That will start the `web`, `api` and `ui` containers. If you have already setup local DNS and [created the SSL certifcates](../packages/web/certs/README.md), then you should be able to reach the site at `https://busmap.localhost`.

### Storybook

A separate container can be started to run Storybook for `packages/components` at `https://busmap.localhost:9000`.

* `docker compose up storybook`

It can also be run locally.

* `npm run storybook -w @busmap/components`

### API

The API server can be configured by defining variables in the root `.env` file, or directly on the CLI when running `docker compose up`.
