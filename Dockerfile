# build environment
FROM node:14.20.1-alpine as build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]