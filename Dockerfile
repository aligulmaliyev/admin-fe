# 1. Build stage
FROM node:20 AS build
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build
RUN npm run build

# 2. Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config (optional custom domain config)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
