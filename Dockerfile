# Use Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the Next.js / Toolpad Core app
RUN npm run build

# Expose port (3000 is default for Toolpad)
EXPOSE 3000

# Start the Toolpad app
CMD ["npm", "start"]
