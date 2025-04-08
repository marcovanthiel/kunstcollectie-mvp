// API functions and context for the Kunstcollectie application
import React, { createContext, useContext, useState } from 'react';

// Create API Context
export const ApiContext = createContext();

/**
 * Custom hook to use the API context
 * @returns {Object} API context value
 */
export const useApi = () => {
  return useContext(ApiContext);
};

/**
 * API Provider component to wrap the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const ApiProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API methods with state management
  const api = {
    // Auth methods
    login: async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Store authentication token if provided
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          
          setUser(data.user);
          return {
            success: true,
            user: data.user,
          };
        } else {
          setError(data.message || 'Login mislukt. Controleer uw gegevens.');
          return {
            success: false,
            message: data.message || 'Login mislukt. Controleer uw gegevens.',
          };
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Er is een fout opgetreden bij het inloggen. Probeer het later opnieuw.');
        return {
          success: false,
          message: 'Er is een fout opgetreden bij het inloggen. Probeer het later opnieuw.',
        };
      } finally {
        setLoading(false);
      }
    },
    
    logout: async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        
        // Always remove token from localStorage on logout attempt
        localStorage.removeItem('token');
        setUser(null);
        
        return {
          success: true,
        };
      } catch (error) {
        console.error('Logout error:', error);
        // Still remove token even if API call fails
        localStorage.removeItem('token');
        setUser(null);
        setError('Er is een fout opgetreden bij het uitloggen.');
        return {
          success: false,
          message: 'Er is een fout opgetreden bij het uitloggen.',
        };
      } finally {
        setLoading(false);
      }
    },
    
    // Artwork methods
    getArtworks: async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/artworks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        
        if (data.success) {
          return {
            success: true,
            artworks: data.artworks,
          };
        } else {
          setError(data.message || 'Kon kunstwerken niet laden.');
          return {
            success: false,
            message: data.message || 'Kon kunstwerken niet laden.',
          };
        }
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError('Er is een fout opgetreden bij het ophalen van kunstwerken.');
        return {
          success: false,
          message: 'Er is een fout opgetreden bij het ophalen van kunstwerken.',
        };
      } finally {
        setLoading(false);
      }
    },
    
    // State
    user,
    loading,
    error,
    
    // State management
    clearError: () => setError(null),
  };

  return (
    <ApiContext.Provider value={{ api }}>
      {children}
    </ApiContext.Provider>
  );
};
