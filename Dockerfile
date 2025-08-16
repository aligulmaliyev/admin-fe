# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
# Node 20-də corepack var
RUN corepack enable && yarn --version
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Runtime
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
