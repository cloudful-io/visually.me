# Stage 1: Build the React app
FROM node:22-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy only package files to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (cleaner and faster, omits dev dependencies)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.27.4-alpine-slim AS prod-stage

# Remove default Nginx static assets (optional but keeps image clean)
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from build-stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80 to be used by the container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]