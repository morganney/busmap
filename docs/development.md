## Development

Development is done using Docker and Compose.

Quick start:

1. `docker compose build`
2. `docker compose up dev`

That will start the `web`, `session`, `api` and `ui` containers. If you have already setup local DNS and [created the SSL certifcates](../packages/web/certs/README.md), then you should be able to reach the site at `https://busmap.localhost`.

### Session

Redis is used to persist the sessions. You can optionally pass `memory` to `BM_SESSION_STORE` to use local memory which will not persist across server restarts, etc.

The best way to remove all the keys in redis is to delete the volume on the host associated with the container.

```
docker container prune
docker volume rm busmap_session
```

### API

The container for the API service is started when running the `dev` service `docker compose up dev`, and the Node.js server is started in [--watch](https://nodejs.org/dist/latest-v20.x/docs/api/cli.html#--watch) mode by default.

The API server can be configured by defining variables in the root `.env` file, or directly on the CLI when running `docker compose up`. These environment variables are then interpolated within `packages/api/.env` and provided to the running container through the compose `env_file` service attribute. Renaming `.env.example` to `.env` is a good starting point.

* `BM_COOKIE_SECRET`: The secret used by `express-session` when signing the cookie.
* `BM_SESSION_STORE`: What store to use for persisting the `express-session` session. Either `memory` or `redis`.
* `DEBUG`: Enable particular logs from [`debug`](https://www.npmjs.com/package/debug), either directly from BusMap source code, or a dependencies.

Here is an example of defining some on the CLI before starting the dev service:

```
DEBUG=express-session BM_SESSION_STORE=redis docker compose up --attach-dependencies dev
```

Or outside of docker:

```
DEBUG=express-session BM_SESSION_STORE=memory npm run dev:local -w api
```

### UI

The UI is built with vite and runs on the same Node.js version as the API service. When developing outside of docker you can configure the vite dev server to [`proxy`](https://vitejs.dev/config/server-options.html#server-proxy) the running API using the `API_HOST` environment variable.

```
API_HOST=http://localhost:3000 npm run dev -w ui
```

You can visualize the built bundles by running `npm run visualizer -w ui`.

### Storybook

A separate container can be started to run Storybook for `packages/components` at `https://busmap.localhost:9000`.

* `docker compose up storybook`

It can also be run locally.

* `npm run storybook -w @busmap/components`
