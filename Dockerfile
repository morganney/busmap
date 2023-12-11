FROM postgres:16.1-bookworm as postgres
COPY packages/api/initdb.d /docker-entrypoint-initdb.d
EXPOSE 5432

FROM redis:7.2.3 AS redis
EXPOSE 6739

FROM node:20.10-bookworm-slim AS busmap
WORKDIR /app
COPY package-lock.json package.json .
COPY packages/api/package.json /app/packages/api/package.json
COPY packages/ui/package.json /app/packages/ui/package.json
COPY packages/components/package.json /app/packages/components/package.json
COPY packages/common/package.json /app/packages/common/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
EXPOSE 3000 5173 9000

FROM busmap AS uibuild
WORKDIR /app
COPY . .
RUN npm run build -w @busmap/components
RUN npm run build -w @busmap/common
RUN npm run build -w ui

FROM nginx:1.25.3 as stage
ARG HOST_NAME=busmap.localhost
COPY packages/web/certs/ /etc/nginx/certs/
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/
COPY packages/web/templates/ /etc/nginx/templates/
COPY packages/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=uibuild /app/packages/ui/dist /var/www/${HOST_NAME}
