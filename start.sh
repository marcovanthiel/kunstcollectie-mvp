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

# Generate Prisma client before starting backend
echo "Generating Prisma client..."
cd backend && npx prisma generate

# Start backend server
echo "Starting backend server on port 3001..."
cd backend && export PORT=3001 && npm run prisma:migrate && npm run prisma:seed && npm start &
BACKEND_PID=$!

# Wait for backend to start - increased wait time
echo "Waiting for backend to start..."
sleep 10

# Start proxy server
cd ..
# Fix: Use absolute path to server.js instead of relative path
node /app/server.js
