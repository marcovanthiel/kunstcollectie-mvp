FROM node:18-alpine

WORKDIR /app

# Install OpenSSL dependencies
RUN apk update && \
    apk add --no-cache openssl openssl-dev

# Copy package.json files
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN npm install && \
    cd frontend && npm install --legacy-peer-deps && cd .. && \
    cd backend && npm install

# Copy the rest of the application
COPY . .

# Set environment variables for backend
ENV DATABASE_URL="postgresql://postgres:vQWftGjQkBnzpPHUJSbXMkDkkplLvscd@postgres.railway.internal:5432/railway"
ENV JWT_SECRET="kunstcollectie_app_secret_key_2025"
ENV PORT=8080
ENV NODE_ENV="production"
ENV FRONTEND_URL="https://kunstcollectie.up.railway.app"

# Generate Prisma client (without migrations during build)
RUN cd backend && npx prisma generate

# Build frontend
RUN cd frontend && npm run build

# Build backend with verbose output to debug any issues
RUN cd backend && NODE_ENV=production npm run build

# Expose port for the application
EXPOSE 8080

# Start the application using the server.js file
CMD ["node", "server.js"]
