FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

# Install dependencies
RUN npm install && \
    cd frontend && npm install --legacy-peer-deps && cd .. && \
    cd backend && npm install && cd ..

# Copy the rest of the application
COPY . .

# Fix vite.config.js if needed
COPY frontend/vite.config.js ./frontend/vite.config.js

# Set environment variables for backend
ENV DATABASE_URL="postgresql://postgres:vQWftGjQkBnzpPHUJSbXMkDkkplLvscd@postgres.railway.internal:5432/railway"
ENV JWT_SECRET="kunstcollectie_app_secret_key_2025"
ENV PORT=8080
ENV BACKEND_PORT=3001
ENV FRONTEND_URL="https://kunstcollectie.up.railway.app"

# Generate Prisma client
RUN cd backend && npx prisma generate

# Build frontend and backend
RUN cd frontend && npm run build && cd .. && \
    cd backend && npm run build

# Expose port for the application
EXPOSE 8080

# Create start script
RUN echo '#!/bin/sh\n\n# Start the backend server in the background with explicit port 3001\ncd /app/backend && PORT=3001 npm start &\n\n# Wait a moment for backend to initialize\nsleep 5\n\n# Start the frontend server on port 8080 (Railway'\''s default port) \ncd /app/frontend && npm run preview -- --host 0.0.0.0 --port 8080' > /app/start.sh && \
    chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"]
