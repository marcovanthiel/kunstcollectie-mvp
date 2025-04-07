FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache bash postgresql-client

# Install OpenSSL 3 for Prisma
RUN apk add --no-cache openssl1.1-compat

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy the rest of the application
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 8080

# Start the application
CMD ["./start.sh"]
