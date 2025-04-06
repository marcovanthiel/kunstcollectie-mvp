FROM node:18-alpine

WORKDIR /app

# Install OpenSSL dependencies
RUN apk update && \
    apk add --no-cache openssl openssl-dev

# Copy package files first for better caching
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN npm install && \
    cd frontend && npm install --legacy-peer-deps && cd .. && \
    cd backend && npm install && cd ..

# Copy the rest of the application
COPY . .

# Set environment variables for backend
ENV DATABASE_URL="postgresql://postgres:vQWftGjQkBnzpPHUJSbXMkDkkplLvscd@postgres.railway.internal:5432/railway"
ENV JWT_SECRET="kunstcollectie_app_secret_key_2025"
ENV PORT=3001
ENV NODE_ENV="production"
ENV FRONTEND_URL="https://kunstcollectie.up.railway.app"

# Generate Prisma client (without migrations during build)
RUN cd backend && \
    npx prisma generate

# Build frontend and backend
RUN cd frontend && npm run build && cd .. && \
    cd backend && npm run build

# Expose port for the application
EXPOSE 8080
EXPOSE 3001

# Create start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"]
