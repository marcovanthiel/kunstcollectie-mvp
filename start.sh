#!/bin/bash
# Start main server
echo "Starting main server on port 8080..."
echo "Current directory: $(pwd)"

# Check if frontend/dist exists and show contents
if [ -d "frontend/dist" ]; then
  echo "Checking if frontend/dist exists: true"
  echo "Contents of frontend/dist: $(ls frontend/dist)"
  
  if [ -d "frontend/dist/assets" ]; then
    echo "Contents of frontend/dist/assets: $(ls frontend/dist/assets)"
  fi
else
  echo "Checking if frontend/dist exists: false"
  echo "WARNING: frontend/dist directory not found!"
fi

# List all directories to debug
echo "Listing all directories in /app:"
ls -la /app

# Check if backend directory exists
if [ ! -d "/app/backend" ]; then
  echo "ERROR: Backend directory not found! Creating necessary structure..."
  # Create backend directory if it doesn't exist
  mkdir -p /app/backend/prisma
  mkdir -p /app/backend/pages/api/auth
  
  # Copy files to the right locations if they exist elsewhere
  if [ -d "/backend" ]; then
    echo "Found backend at root level, copying files..."
    cp -r /backend/* /app/backend/
  fi
fi

# Generate Prisma client before starting backend
echo "Generating Prisma client..."
cd /app/backend && npx prisma generate

# Start backend server
echo "Starting backend server on port 3001..."
cd /app/backend && export PORT=3001 && npm run prisma:migrate && npm run prisma:seed && npm start &
BACKEND_PID=$!

# Wait for backend to start - increased wait time
echo "Waiting for backend to start..."
sleep 10

# Start proxy server
cd /app
# Fix: Use absolute path to server.js
node /app/server.js
