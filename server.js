const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_PORT = 3001;

// Start the backend server with explicit PORT environment variable
function startBackend() {
  console.log(`Starting backend server on port ${BACKEND_PORT}...`);
  // Use explicit environment variable setting for the backend port
  const backendProcess = exec(`cd backend && export PORT=${BACKEND_PORT} && npm run prisma:migrate && npm start`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backend error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Backend stderr: ${stderr}`);
    }
    console.log(`Backend stdout: ${stdout}`);
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    // Restart backend if it crashes
    if (code !== 0) {
      console.log('Restarting backend...');
      setTimeout(startBackend, 5000);
    }
  });
}

// Start the main server first
console.log(`Starting main server on port ${PORT}...`);
// Setup API proxy to backend
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${BACKEND_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Start the main server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Main server running on port ${PORT}`);
  console.log(`API requests will be proxied to backend on port ${BACKEND_PORT}`);
  
  // Only start the backend after the main server is running
  startBackend();
});
