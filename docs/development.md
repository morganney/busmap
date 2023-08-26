## Development

Development is done using Docker and Compose.

Quick start:

1. `docker compose build`
2. `docke compose up dev`

That will start the `web`, `api` and `ui` containers. If you have already setup local DNS and created the SSL certifcates, then you should be able to reach the site at `https://busmap.localhost`.
