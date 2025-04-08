// server.js - Main server file for the Kunstcollectie application

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { exec } = require('child_process');
const fs = require('fs');

// Create Express app
const app = express();
// Use only process.env.PORT to let Railway determine the port
// This fixes the EADDRINUSE error during deployment
const PORT = process.env.PORT || 3000;
const BACKEND_PORT = 3001;

// Check if frontend/dist exists
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
const frontendDistExists = fs.existsSync(frontendDistPath);
console.log(`Checking if frontend/dist exists: ${frontendDistExists}`);

if (frontendDistExists) {
  console.log(`Contents of frontend/dist: ${fs.readdirSync(frontendDistPath).join('\n')}`);
  
  // Check for assets directory
  const assetsPath = path.join(frontendDistPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    console.log(`Contents of frontend/dist/assets: ${fs.readdirSync(assetsPath).join('\n')}`);
  }
}

// Serve static files from frontend/dist
app.use(express.static(frontendDistPath));

// Start backend server
console.log(`Starting backend server on port ${BACKEND_PORT}...`);

// Function to run database migration script
function migrateDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Running database migration script...');
    exec('node backend/migrate-database.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Database migration error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        // Don't reject here, try to continue
        console.log('Continuing despite migration error...');
      }
      console.log(`Database migration output: ${stdout}`);
      resolve();
    });
  });
}

// Function to run database setup script
function setupDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Running database setup script...');
    exec('node backend/setup-database.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Database setup error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        // Don't reject here, try to continue
        console.log('Continuing despite setup error...');
      }
      console.log(`Database setup output: ${stdout}`);
      resolve();
    });
  });
}

// Function to start backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    // First generate Prisma client
    console.log('Generating Prisma client...');
    exec('cd backend && npx prisma generate', (error, stdout, stderr) => {
      if (error) {
        console.error(`Prisma generate error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        // Don't reject here, try to continue
        console.log('Continuing despite Prisma generate error...');
      }
      console.log(stdout);
      
      // Run database migration script
      migrateDatabase()
        .then(() => {
          // Then run database migrations
          console.log('Running database migrations...');
          exec('cd backend && npx prisma migrate deploy', (error, stdout, stderr) => {
            if (error) {
              console.error(`Migration error: ${error.message}`);
              console.error(`stderr: ${stderr}`);
              // Don't reject here, try to continue
              console.log('Continuing despite migration error...');
            }
            console.log(stdout);
            
            // Run database setup script
            setupDatabase()
              .then(() => {
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
              })
              .catch(err => {
                console.error('Setup database error:', err);
                // Continue anyway
                resolve();
              });
          });
        })
        .catch(err => {
          console.error('Migrate database error:', err);
          // Continue anyway
          resolve();
        });
    });
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
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
    
    // Start main server
    app.listen(PORT, () => {
      console.log(`Starting main server on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error('Failed to start backend:', error);
    // Try to start the server anyway
    app.listen(PORT, () => {
      console.log(`Starting main server on port ${PORT} despite backend errors...`);
    });
  });
