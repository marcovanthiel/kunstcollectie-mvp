import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApiProvider } from './api'

// Add error handling for React rendering
try {
  console.log('Initializing React application...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found in the DOM');
    // Create a fallback element if root is not found
    const fallbackElement = document.createElement('div');
    fallbackElement.id = 'root';
    document.body.appendChild(fallbackElement);
    console.log('Created fallback root element');
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <ApiProvider>
        <App />
      </ApiProvider>
    </React.StrictMode>
  );
  console.log('React application rendered successfully');
} catch (error) {
  console.error('Error rendering React application:', error);
  // Display error on page for debugging
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Error Initializing Application</h1>
      <p>An error occurred while loading the application:</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">${error.message}\n\n${error.stack}</pre>
    </div>
  `;
}
