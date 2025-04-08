// API Context en Provider voor Kunstcollectie Applicatie
import React, { createContext, useContext, useState } from 'react';

// Creëer de API context
export const ApiContext = createContext();

// Custom hook om de API context te gebruiken
export const useApi = () => useContext(ApiContext);

// API Provider component
export const ApiProvider = ({ children }) => {
  // API basis URL
  const API_BASE_URL = '/api';
  
  // API client met alle benodigde methoden
  const api = {
    // Authenticatie methoden
    async login(email, password) {
      console.log(`API: Attempting login for ${email}`);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include', // Belangrijk voor cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login mislukt');
        }
        
        const data = await response.json();
        console.log('API: Login successful', data);
        
        // Sla API key op in localStorage als die beschikbaar is
        if (data.apiKey) {
          localStorage.setItem('apiKey', data.apiKey);
        }
        
        return data;
      } catch (error) {
        console.error('API: Login error', error);
        throw error;
      }
    },
    
    async logout() {
      console.log('API: Logging out');
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include', // Belangrijk voor cookies
        });
        
        // Verwijder API key uit localStorage
        localStorage.removeItem('apiKey');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Logout mislukt');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API: Logout error', error);
        throw error;
      }
    },
    
    async register(name, email, password) {
      console.log(`API: Registering user ${email}`);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
          credentials: 'include', // Belangrijk voor cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registratie mislukt');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API: Registration error', error);
        throw error;
      }
    },
    
    // Kunstwerk methoden
    async getArtworks() {
      console.log('API: Fetching artworks');
      try {
        // Voeg API key toe aan headers als die beschikbaar is
        const headers = {
          'Content-Type': 'application/json',
        };
        
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }
        
        const response = await fetch(`${API_BASE_URL}/artworks`, {
          method: 'GET',
          headers,
          credentials: 'include', // Belangrijk voor cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Kon kunstwerken niet ophalen');
        }
        
        const data = await response.json();
        console.log(`API: Fetched ${data.artworks?.length || 0} artworks`);
        return data;
      } catch (error) {
        console.error('API: Error fetching artworks', error);
        throw error;
      }
    },
    
    async getArtwork(id) {
      console.log(`API: Fetching artwork ${id}`);
      try {
        // Voeg API key toe aan headers als die beschikbaar is
        const headers = {
          'Content-Type': 'application/json',
        };
        
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }
        
        const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
          method: 'GET',
          headers,
          credentials: 'include', // Belangrijk voor cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Kon kunstwerk niet ophalen');
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API: Error fetching artwork ${id}`, error);
        throw error;
      }
    },
    
    async createArtwork(artworkData) {
      console.log('API: Creating new artwork', artworkData);
      try {
        // Voeg API key toe aan headers als die beschikbaar is
        const headers = {
          'Content-Type': 'application/json',
        };
        
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }
        
        const response = await fetch(`${API_BASE_URL}/artworks`, {
          method: 'POST',
          headers,
          body: JSON.stringify(artworkData),
          credentials: 'include', // Belangrijk voor cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Kon kunstwerk niet aanmaken');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API: Error creating artwork', error);
        throw error;
      }
    },
    
    async updateArtwork(id, artworkData) {
      console.log(`API: Updating artwork ${id}`, artworkData);
      try {
        // Voeg API key toe aan headers als die beschikbaar is
        const headers = {
          'Content-Type': 'application/json',
        };
        
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }
        
        const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(artworkData),
          credentials: 'include', // Belangrijk voor cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Kon kunstwerk niet bijwerken');
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API: Error updating artwork ${id}`, error);
        throw error;
      }
    },
    
    async deleteArtwork(id) {
      console.log(`API: Deleting artwork ${id}`);
      try {
        // Voeg API key toe aan headers als die beschikbaar is
        const headers = {
          'Content-Type': 'application/json',
        };
        
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }
        
        const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
          method: 'DELETE',
          headers,
          credentials: 'include', // Belangrijk voor cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Kon kunstwerk niet verwijderen');
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API: Error deleting artwork ${id}`, error);
        throw error;
      }
    }
  };
  
  // Waarde die beschikbaar wordt gemaakt via de context
  const contextValue = { api };
  
  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};
