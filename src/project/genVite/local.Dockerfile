FROM node:18.16.0-buster-slim AS build-stage
WORKDIR /app
ADD . /app
RUN npm install -g pnpm@8.4.0
RUN pnpm install --frozen-lockfile
# RUN npm install --slient
RUN pnpm build --base=/
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["ls", "nginx", "-g", "daemon off;"]

