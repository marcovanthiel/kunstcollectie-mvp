import { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ArtworkList from './components/ArtworkList'
import ArtworkDetail from './components/ArtworkDetail'
import ArtworkForm from './components/ArtworkForm'

// Create auth context to share authentication state across components
export const AuthContext = createContext();

function App() {
  console.log('App component initializing with simplified authentication...');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle logout that can be passed to child components
  const handleLogout = async () => {
    console.log('Logging out user with simplified authentication...');
    try {
      // Call the logout API endpoint to clear cookies
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      
      // Clear localStorage
      localStorage.removeItem('apiKey');
      
      // Update state
      setIsLoggedIn(false);
      setUser(null);
      
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if there's an error, we still want to log out the user locally
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    try {
      console.log('Checking authentication status with simplified authentication...');
      
      // Check for session cookie by making a request to a protected endpoint
      fetch('/api/auth/check', {
        credentials: 'include', // Important for cookies
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          // If not authenticated, ensure we're logged out
          setIsLoggedIn(false);
          throw new Error('Not authenticated');
        })
        .then(data => {
          if (data && data.authenticated) {
            console.log('User is authenticated via cookies');
            setIsLoggedIn(true);
            setUser(data.user);
          } else {
            console.log('User is not authenticated');
            setIsLoggedIn(false);
          }
        })
        .catch(err => {
          console.log('Authentication check failed, assuming not logged in:', err.message);
          setIsLoggedIn(false);
        })
        .finally(() => {
          setIsLoading(false);
          
          // Remove loading indicator from index.html
          const loadingIndicator = document.getElementById('loading-indicator');
          if (loadingIndicator && loadingIndicator.parentNode) {
            loadingIndicator.style.display = 'none';
          }
        });
    } catch (err) {
      console.error('Error during authentication check:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  // Handle errors
  if (error) {
    return (
      <div className="error-container">
        <h2>Er is een fout opgetreden</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Probeer opnieuw
        </button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <h2>Laden...</h2>
        <p>Even geduld a.u.b.</p>
      </div>
    );
  }

  console.log('App rendering with isLoggedIn:', isLoggedIn);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, handleLogout }}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={
              isLoggedIn ? 
                <Navigate to="/" replace /> : 
                <Login />
            } />
            <Route path="/register" element={
              isLoggedIn ? 
                <Navigate to="/" replace /> : 
                <Register />
            } />
            <Route path="/" element={
              isLoggedIn ? 
                <Dashboard /> : 
                <Navigate to="/login" replace />
            } />
            <Route path="/artworks" element={
              isLoggedIn ? 
                <ArtworkList /> : 
                <Navigate to="/login" replace />
            } />
            <Route path="/artworks/:id" element={
              isLoggedIn ? 
                <ArtworkDetail /> : 
                <Navigate to="/login" replace />
            } />
            <Route path="/artworks/new" element={
              isLoggedIn ? 
                <ArtworkForm /> : 
                <Navigate to="/login" replace />
            } />
            <Route path="/artworks/edit/:id" element={
              isLoggedIn ? 
                <ArtworkForm /> : 
                <Navigate to="/login" replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
