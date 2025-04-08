import React, { createContext, useContext, useState } from 'react';
import * as apiService from '../api';

// Create API Context
const ApiContext = createContext();

/**
 * Custom hook to use the API context
 * @returns {Object} API context value
 */
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
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
        const result = await apiService.login(email, password);
        if (result.success) {
          setUser(result.user);
        } else {
          setError(result.message);
        }
        return result;
      } catch (err) {
        setError('Er is een fout opgetreden bij het inloggen.');
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    
    logout: async () => {
      setLoading(true);
      try {
        const result = await apiService.logout();
        setUser(null);
        return result;
      } catch (err) {
        setError('Er is een fout opgetreden bij het uitloggen.');
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    
    // Artwork methods
    getArtworks: async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiService.getArtworks();
        return result;
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van kunstwerken.');
        return { success: false, message: err.message };
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
