## Builder
FROM node:14-alpine AS builder
ARG BUILD_ENVIRONMENT

RUN apk add python3 make g++ --update

WORKDIR /app/
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm i --unsafe
COPY ./shared/ /app/shared/

WORKDIR /app/maintenance-frontend/
COPY ./maintenance-frontend/package.json ./package.json
COPY ./maintenance-frontend/package-lock.json ./package-lock.json
RUN npm i --unsafe
COPY ./maintenance-frontend/ ./

RUN SKIP_PREFLIGHT_CHECK=true PUBLIC_URL=. npm run "build"

FROM nginx:latest
COPY --from=BUILDER /app/maintenance-frontend/build /usr/share/nginx/html
