# === Stage 1: Build Angular App ===
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY ../FrontEnd/package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY ../FrontEnd .

# Build the Angular app with the base href /gambling99/
RUN npm run build -- --configuration production --base-href /gambling99/

# Debug: list build output contents
RUN ls -l /app/dist/slot-machine-front-end/browser

# === Stage 2: Serve with NGINX ===
FROM nginx:alpine

# Remove default nginx configs
RUN rm /etc/nginx/conf.d/*

# Copy your custom nginx config
COPY ./NginX/default.conf /etc/nginx/conf.d/default.conf

# Copy the Angular build output (the browser folder) to nginx's html directory
COPY --from=builder /app/dist/slot-machine-front-end/browser /usr/share/nginx/html/gambling99

EXPOSE 8080