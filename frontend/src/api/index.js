import { createContext, useState } from 'react';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState('/api');
  
  const api = {
    // Authentication
    login: async (email, password) => {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return response.json();
    },
    
    register: async (name, email, password) => {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      return response.json();
    },
    
    // Artworks
    getArtworks: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/artworks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch artworks');
      }
      
      return response.json();
    },
    
    getArtwork: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/artworks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch artwork');
      }
      
      return response.json();
    },
    
    createArtwork: async (artworkData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/artworks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(artworkData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create artwork');
      }
      
      return response.json();
    },
    
    updateArtwork: async (id, artworkData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/artworks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(artworkData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update artwork');
      }
      
      return response.json();
    },
    
    deleteArtwork: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/artworks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete artwork');
      }
      
      return response.json();
    }
  };
  
  return {
    api
  };
}
