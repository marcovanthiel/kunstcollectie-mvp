const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Start the backend server
function startBackend() {
  console.log('Starting backend server...');
  const backendProcess = exec('cd backend && npm run prisma:migrate && npm start', (error, stdout, stderr) => {
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

// Start the backend server
startBackend();

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
