// Alternative fix option - Use process.cwd() to ensure correct path resolution
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

// Log the current working directory for debugging
console.log('Current working directory:', process.cwd());

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Log middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Proxy API requests to backend
app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  }
}));

// Special handling for favicon.svg and vite.svg
app.get('/favicon.svg', (req, res) => {
  const faviconPath = path.join(process.cwd(), 'frontend/public/favicon.svg');
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    // Fallback SVG if file doesn't exist
    res.set('Content-Type', 'image/svg+xml');
    res.send('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#663399" /></svg>');
  }
});

app.get('/vite.svg', (req, res) => {
  // Redirect to favicon.svg
  res.redirect('/favicon.svg');
});

// Serve static files from frontend/dist
// Fix: Use absolute path with __dirname instead of process.cwd()
app.use(express.static(path.join('/app', 'frontend/dist')));

// Serve index.html for all other routes (SPA support)
// Fix: Use absolute path with __dirname instead of process.cwd()
app.get('*', (req, res) => {
  const indexPath = path.join('/app', 'frontend/dist/index.html');
  console.log('Attempting to serve index.html from:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('Error: index.html not found at', indexPath);
    res.status(404).send('Error: index.html not found. Please check server configuration.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
  
  // Log directory contents for debugging
  console.log('Contents of frontend/dist:');
  try {
    // Fix: Use absolute path instead of process.cwd()
    const distPath = '/app/frontend/dist';
    if (fs.existsSync(distPath)) {
      console.log(fs.readdirSync(distPath));
      
      const assetsPath = path.join(distPath, 'assets');
      if (fs.existsSync(assetsPath)) {
        console.log('Contents of frontend/dist/assets:');
        console.log(fs.readdirSync(assetsPath));
      }
    } else {
      console.log('frontend/dist directory not found!');
      // List all directories in /app for debugging
      console.log('Contents of /app:', fs.readdirSync('/app'));
      if (fs.existsSync('/app/frontend')) {
        console.log('Contents of /app/frontend:', fs.readdirSync('/app/frontend'));
      }
    }
  } catch (error) {
    console.error('Error checking directories:', error);
  }
});
