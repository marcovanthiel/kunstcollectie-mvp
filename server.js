// server.js - Simplified version for Railway deployment
// This version specifically addresses the port conflict issue

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { exec } = require('child_process');
const fs = require('fs');

// Create Express app
const app = express();

// IMPORTANT: Use only process.env.PORT to let Railway determine the port
// This is critical to fix the EADDRINUSE error during deployment
const PORT = process.env.PORT;
console.log(`Using PORT from environment: ${PORT}`);

// Only use fallback port for local development, not in production
if (!PORT) {
  console.log('No PORT environment variable found, using fallback port 3000 for local development');
}

const BACKEND_PORT = 3001;

// Check if frontend/dist exists
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
const frontendDistExists = fs.existsSync(frontendDistPath);
console.log(`Checking if frontend/dist exists: ${frontendDistExists}`);

// Serve static files from frontend/dist if it exists
if (frontendDistExists) {
  app.use(express.static(frontendDistPath));
}

// Start backend server
console.log(`Starting backend server on port ${BACKEND_PORT}...`);

// Function to start backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    try {
      // Generate Prisma client
      console.log('Generating Prisma client...');
      exec('cd backend && npx prisma generate', (error, stdout, stderr) => {
        if (error) {
          console.error(`Prisma generate error: ${error.message}`);
          // Continue despite errors
        }
        
        // Run database migrations
        console.log('Running database migrations...');
        exec('cd backend && npx prisma migrate deploy', (error, stdout, stderr) => {
          if (error) {
            console.error(`Migration error: ${error.message}`);
            // Continue despite errors
          }
          
          // Start backend server
          const backendProcess = exec('cd backend && npm run dev');
          
          backendProcess.stdout.on('data', (data) => {
            console.log(`Backend: ${data}`);
          });
          
          backendProcess.stderr.on('data', (data) => {
            console.error(`Backend error: ${data}`);
          });
          
          // Give the backend some time to start
          setTimeout(() => {
            console.log('Backend URL:', `http://localhost:${BACKEND_PORT}`);
            resolve();
          }, 5000);
        });
      });
    } catch (error) {
      console.error('Error starting backend:', error);
      // Continue despite errors
      resolve();
    }
  });
}

// Wait for backend to start
console.log('Waiting for backend to start...');
startBackend()
  .then(() => {
    // Set up proxy middleware for API requests
    app.use('/', createProxyMiddleware({
      target: `http://localhost:${BACKEND_PORT}`,
      changeOrigin: true,
      logLevel: 'debug'
    }));
    
    // For any other routes, serve the frontend
    app.get('*', (req, res) => {
      if (frontendDistExists) {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
      } else {
        res.send('Frontend not found. Please build the frontend first.');
      }
    });
    
    // Start main server with the PORT provided by Railway
    // This is the critical part to fix the EADDRINUSE error
    if (PORT) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} provided by Railway`);
      });
    } else {
      // Only for local development
      app.listen(3000, () => {
        console.log('Server running on fallback port 3000 for local development');
      });
    }
  })
  .catch((error) => {
    console.error('Failed to start backend:', error);
    
    // Start server anyway, even if backend fails
    if (PORT) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} despite backend errors`);
      });
    } else {
      app.listen(3000, () => {
        console.log('Server running on fallback port 3000 despite backend errors');
      });
    }
  });
