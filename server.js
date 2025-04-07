const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_PORT = 3001;

// Start the backend server with explicit PORT environment variable
function startBackend() {
  console.log(`Starting backend server on port ${BACKEND_PORT}...`);
  // Use explicit environment variable setting for the backend port
  // Skip the build step since it's already done in the Dockerfile
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
      // If backend crashes, try rebuilding and restarting
      const rebuildProcess = exec(`cd backend && export PORT=${BACKEND_PORT} && npm run build && npm run prisma:migrate && npm start`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Backend rebuild error: ${error.message}`);
          // If rebuild fails, try regular restart after delay
          setTimeout(startBackend, 5000);
          return;
        }
      });
      
      rebuildProcess.stdout.on('data', (data) => {
        console.log(`Backend rebuild: ${data}`);
      });
      
      rebuildProcess.stderr.on('data', (data) => {
        console.error(`Backend rebuild error: ${data}`);
      });
    }
  });
}

// Start the main server first
console.log(`Starting main server on port ${PORT}...`);

// Log the current directory and check if frontend/dist exists
console.log(`Current directory: ${__dirname}`);
const distPath = path.join(__dirname, 'frontend/dist');
console.log(`Checking if frontend/dist exists: ${fs.existsSync(distPath)}`);
if (fs.existsSync(distPath)) {
  console.log(`Contents of frontend/dist: ${fs.readdirSync(distPath).join(', ')}`);
  
  // Check if assets directory exists and log its contents
  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    console.log(`Contents of frontend/dist/assets: ${fs.readdirSync(assetsPath).join(', ')}`);
  }
}

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

// Serve static files from the frontend build directory with proper caching
app.use(express.static(path.join(__dirname, 'frontend/dist'), {
  etag: true, // Enable ETag for caching
  lastModified: true, // Enable Last-Modified for caching
  setHeaders: (res, filePath) => {
    // Set cache control headers for assets
    if (filePath.includes('/assets/')) {
      // Cache assets for 1 week
      res.setHeader('Cache-Control', 'public, max-age=604800');
    } else {
      // Don't cache HTML files
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Redirect root to login
app.get('/', (req, res) => {
  console.log('Root path requested, redirecting to /login');
  res.redirect('/login');
});

// Special handling for favicon.svg to ensure it's properly served
app.get('/favicon.svg', (req, res) => {
  console.log('Favicon.svg requested, attempting to serve');
  const svgPath = path.join(__dirname, 'frontend/dist/favicon.svg');
  if (fs.existsSync(svgPath)) {
    console.log('Serving favicon.svg from dist directory');
    res.sendFile(svgPath);
  } else {
    console.log('Favicon.svg not found in dist, checking assets directory');
    // Try to find it in the assets directory
    const assetsDir = path.join(__dirname, 'frontend/dist/assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const svgFile = files.find(file => file.includes('favicon') && file.endsWith('.svg'));
      if (svgFile) {
        console.log(`Found favicon in assets: ${svgFile}`);
        res.sendFile(path.join(assetsDir, svgFile));
        return;
      }
    }
    
    // If still not found, try serving from public directory
    const publicSvgPath = path.join(__dirname, 'frontend/public/favicon.svg');
    if (fs.existsSync(publicSvgPath)) {
      console.log('Serving favicon.svg from public directory');
      res.sendFile(publicSvgPath);
      return;
    }
    
    console.log('Favicon.svg not found anywhere, serving fallback');
    // If not found anywhere, send a simple SVG as fallback
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#4F46E5"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
    </svg>`);
  }
});

// Maintain backward compatibility with vite.svg requests
app.get('/vite.svg', (req, res) => {
  console.log('Vite.svg requested, redirecting to favicon.svg');
  res.redirect('/favicon.svg');
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  console.log(`Serving index.html for path: ${req.path}`);
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Start the main server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Main server running on port ${PORT}`);
  console.log(`API requests will be proxied to backend on port ${BACKEND_PORT}`);
  
  // Only start the backend after the main server is running
  startBackend();
});
