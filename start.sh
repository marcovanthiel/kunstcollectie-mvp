#!/bin/sh

# Start the backend server in the background with explicit port 3001
cd /app/backend && PORT=3001 npm start &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 10

# Start the frontend server on port 8080 (Railway's default port)
cd /app/frontend && npm run preview -- --host 0.0.0.0 --port 8080 &
FRONTEND_PID=$!

# Keep the container running and monitor both processes
wait $BACKEND_PID $FRONTEND_PID
