FROM node:20.9-bookworm-slim AS busmap
WORKDIR /app
COPY package-lock.json package.json .
COPY packages/api/package.json /app/packages/api/package.json
COPY packages/ui/package.json /app/packages/ui/package.json
COPY packages/components/package.json /app/packages/components/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
EXPOSE 3000 5173 9000

FROM busmap AS uibuild
WORKDIR /app
COPY . .
RUN npm run build -w @busmap/components
RUN npm run build -w ui

FROM nginx:1.25.2 AS dev
COPY packages/web/nginx.local.conf /etc/nginx/nginx.conf
COPY packages/web/certs/ /etc/nginx/certs/
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/

FROM nginx:1.25.2 as stage
COPY packages/web/certs/ /etc/nginx/certs/
COPY packages/web/conf.d/core/ /etc/nginx/conf.d/core/
# Set stage.local.conf as the default server block in the container
COPY packages/web/conf.d/stage.local.conf /etc/nginx/conf.d/default.conf
COPY packages/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=uibuild /app/packages/ui/dist /var/www/busmap.localhost

FROM nginx:1.25.2 AS web
# core nginx conf
COPY packages/web/nginx.conf /etc/nginx/nginx.conf
# dir nginx confs
COPY packages/web/conf.d/ /etc/nginx/conf.d/
# ssl certs
COPY packages/web/certs/ /etc/nginx/certs/
# ui build
COPY --from=uibuild /app/packages/ui/dist /usr/share/nginx/html
