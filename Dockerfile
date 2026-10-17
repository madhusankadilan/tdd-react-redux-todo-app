FROM node:24-alpine AS build
WORKDIR /usr/app
COPY . /usr/app
RUN npm ci
RUN npm run build

FROM nginx:1.24.0-alpine
EXPOSE 80
COPY ./docker/nginx/conf/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/dist /usr/share/nginx/html
