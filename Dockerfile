# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime: static nginx
FROM nginx:1.27-alpine
# SPA faylları
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
