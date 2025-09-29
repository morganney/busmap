# syntax=docker/dockerfile:1.7-labs

FROM postgres:16.1-bookworm AS postgres
COPY packages/api/initdb.d /docker-entrypoint-initdb.d
EXPOSE 5432

FROM redis:7.2.3 AS redis
EXPOSE 6379

FROM node:24.9.0-bookworm AS builder-base
WORKDIR /app
COPY package.json ./
COPY --parents packages/**/package.json ./
RUN npm config set registry https://registry.npmjs.org/
# Install dependencies (lockfile will be generated inside Linux)
RUN npm install
COPY . .

# Build shared packages used by both api and ui
FROM builder-base AS builder-common
RUN npm run build -w @busmap/components \
 && npm run build -w @busmap/common

# Build API only (depends on common)
FROM builder-common AS builder-api
RUN npm run build -w api

# Build UI only (depends on common)
FROM builder-common AS builder-ui
ARG VITE_GOOG_CLIENT_ID
RUN npm run build -w ui

FROM node:24.9.0-bookworm-slim AS busmap
WORKDIR /app
COPY --chown=node:node --from=builder-common /app/package.json package.json
COPY --chown=node:node --from=builder-common /app/package-lock.json package-lock.json
COPY --chown=node:node --from=builder-api /app/packages/api/dist packages/api/dist
COPY --chown=node:node --from=builder-common /app/packages/api/package.json packages/api/package.json
COPY --chown=node:node --from=builder-common /app/packages/common/package.json packages/common/package.json
RUN npm install --package-lock-only && npm ci --omit=dev
EXPOSE 3000

FROM nginx:1.25.3 AS web
ARG HOST_NAME=busmap.localhost
COPY packages/web/certs/ /etc/nginx/certs/
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/
COPY packages/web/templates/core/ /etc/nginx/templates/core/
COPY packages/web/templates/default.conf.template /etc/nginx/templates/default.conf.template
COPY packages/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder-ui /app/packages/ui/dist /var/www/${HOST_NAME}
EXPOSE 80 443

FROM nginx:1.25.3 AS proxy
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/
COPY packages/web/templates/core/upstreams.conf.template /etc/nginx/templates/core/upstreams.conf.template
COPY packages/web/templates/deploy.conf.template /etc/nginx/templates/default.conf.template
COPY packages/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder-ui /app/packages/ui/dist /var/www/busmap
EXPOSE 80

FROM nginx:1.25.3 AS dev
COPY packages/web/certs/ /etc/nginx/certs/
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/
COPY packages/web/default.dev.conf /etc/nginx/conf.d/default.conf
COPY packages/web/templates/core/upstreams.conf.template /etc/nginx/templates/core/upstreams.conf.template
COPY packages/web/nginx.dev.conf /etc/nginx/nginx.conf
EXPOSE 80 443

FROM builder-common AS playwright
RUN apt-get update
RUN apt-get install -y vim
RUN npx playwright install
RUN npx playwright install-deps

FROM adminer:4.8.1 AS adminer
EXPOSE 8080
