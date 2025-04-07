#!/bin/bash

# Start script for kunstcollectie application
echo "Starting main server on port 8080..."
echo "Current directory: $(pwd)"

# Check if frontend/dist exists
if [ -d "frontend/dist" ]; then
  echo "Checking if frontend/dist exists: true"
  echo "Contents of frontend/dist: $(ls frontend/dist)"
  
  if [ -d "frontend/dist/assets" ]; then
    echo "Contents of frontend/dist/assets: $(ls frontend/dist/assets)"
  fi
else
  echo "Checking if frontend/dist exists: false"
  echo "ERROR: frontend/dist directory not found!"
  exit 1
fi

# Run database migrations and seed
cd backend
echo "Running database migrations..."
npm run prisma:migrate

echo "Seeding database with admin users..."
npm run prisma:seed

# Start the backend server
echo "Starting backend server on port 3001..."
npm run start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Go back to root directory
cd ..

# Start the main server
echo "Main server running on port 8080"
echo "API requests will be proxied to backend on port 3001"

# Start the proxy server
node server.js

# If the proxy server exits, kill the backend
kill $BACKEND_PID
