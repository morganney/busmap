FROM node:20.5.1-slim AS busmap
WORKDIR /app
COPY package-lock.json package.json .
COPY packages/api/package.json /app/packages/api/package.json
COPY packages/ui/package.json /app/packages/ui/package.json
COPY packages/components/package.json /app/packages/components/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
EXPOSE 3000 5173 9000

FROM nginx:1.25.2 AS dev
# core nginx conf
COPY packages/web/nginx.local.conf /etc/nginx/nginx.conf
# dir nginx confs
COPY packages/web/conf.d/ /etc/nginx/conf.d/
# ssl certs
COPY packages/web/certs/ /etc/nginx/certs/

FROM nginx:1.25.2 AS web
# core nginx conf
COPY packages/web/nginx.conf /etc/nginx/nginx.conf
# dir nginx confs
COPY packages/web/conf.d/ /etc/nginx/conf.d/
# ssl certs
COPY packages/web/certs/ /etc/nginx/certs/
# ui build
COPY packages/ui/dist /usr/share/nginx/html
#COPY --from=ui packages/ui/dist /usr/share/nginx/html
