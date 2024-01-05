FROM postgres:16.1-bookworm as postgres
COPY packages/api/initdb.d /docker-entrypoint-initdb.d
EXPOSE 5432

FROM redis:7.2.3 AS redis
EXPOSE 6379

FROM node:20.10-bookworm AS builder
ARG VITE_GOOG_CLIENT_ID
WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
RUN npm run build -w @busmap/components
RUN npm run build -w @busmap/common
RUN npm run build -w api
RUN npm run build -w ui
EXPOSE 3000 5173 9000

FROM node:20.10-bookworm-slim AS busmap
WORKDIR /app
COPY --chown=node:node --from=builder /app/package.json package.json
COPY --chown=node:node --from=builder /app/package-lock.json package-lock.json
COPY --chown=node:node --from=builder /app/packages/api/dist packages/api/dist
COPY --chown=node:node --from=builder /app/packages/api/package.json packages/api/package.json
COPY --chown=node:node --from=builder /app/packages/common/package.json packages/common/package.json
RUN npm install --package-lock-only && npm ci --omit=dev
EXPOSE 3000

FROM nginx:1.25.3 as web
ARG HOST_NAME=busmap.localhost
COPY packages/web/certs/ /etc/nginx/certs/
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/
COPY packages/web/templates/ /etc/nginx/templates/
COPY packages/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/packages/ui/dist /var/www/${HOST_NAME}
EXPOSE 80 443

FROM nginx:1.25.3 AS dev
COPY packages/web/certs/ /etc/nginx/certs/
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/
COPY packages/web/default.dev.conf /etc/nginx/conf.d/default.conf
COPY packages/web/nginx.dev.conf /etc/nginx/nginx.conf
EXPOSE 80 443

FROM adminer:4.8.1 as adminer
EXPOSE 8080
