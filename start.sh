#!/bin/sh

# Start the backend server in the background
cd /app/backend && npm start &

# Wait a moment for backend to initialize
sleep 5

# Start the frontend server
cd /app/frontend && npm run preview -- --host 0.0.0.0 --port $PORT
