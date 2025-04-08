FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache bash postgresql-client
RUN apk add --no-cache openssl

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

# Copy application code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Build backend - this is the critical addition
RUN cd backend && npm run build

# Expose port
EXPOSE 8080

# Start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
