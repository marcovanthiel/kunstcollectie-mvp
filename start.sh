#!/bin/sh

# Run Prisma migrations at runtime when database is accessible
echo "Running Prisma migrations..."
cd /app/backend && npx prisma migrate deploy

# Start the backend server in the background with explicit port 3001
echo "Starting backend server..."
cd /app/backend && PORT=3001 npm start &
BACKEND_PID=$!

# Wait a moment for backend to initialize
echo "Waiting for backend to initialize..."
sleep 10

# Start the frontend server on port 8080 (Railway's default port)
echo "Starting frontend server..."
cd /app/frontend && npm run preview -- --host 0.0.0.0 --port 8080 &
FRONTEND_PID=$!

# Keep the container running and monitor both processes
echo "All services started. Monitoring processes..."
wait $BACKEND_PID $FRONTEND_PID
