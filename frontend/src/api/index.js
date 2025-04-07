import { createContext } from 'react';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // Add debugging for API context initialization
  console.log('Initializing ApiProvider...');
  
  try {
    const baseUrl = '/api';
    
    const api = {
      // Authentication
      login: async (email, password) => {
        console.log(`Attempting login for email: ${email}`);
        try {
          const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.error('Login failed:', error);
            throw new Error(error.message || 'Login failed');
          }
          
          const data = await response.json();
          console.log('Login successful');
          return data;
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      
      register: async (name, email, password) => {
        console.log(`Attempting registration for email: ${email}`);
        try {
          const response = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.error('Registration failed:', error);
            throw new Error(error.message || 'Registration failed');
          }
          
          const data = await response.json();
          console.log('Registration successful');
          return data;
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },
      
      // Artworks
      getArtworks: async () => {
        console.log('Fetching artworks...');
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${baseUrl}/artworks`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch artworks:', error);
            throw new Error(error.message || 'Failed to fetch artworks');
          }
          
          const data = await response.json();
          console.log('Artworks fetched successfully');
          return data;
        } catch (error) {
          console.error('Error fetching artworks:', error);
          throw error;
        }
      },
      
      getArtwork: async (id) => {
        console.log(`Fetching artwork with id: ${id}`);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${baseUrl}/artworks/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to fetch artwork ${id}:`, error);
            throw new Error(error.message || 'Failed to fetch artwork');
          }
          
          const data = await response.json();
          console.log('Artwork fetched successfully');
          return data;
        } catch (error) {
          console.error(`Error fetching artwork ${id}:`, error);
          throw error;
        }
      },
      
      createArtwork: async (artworkData) => {
        console.log('Creating new artwork:', artworkData);
        try {
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
            console.error('Failed to create artwork:', error);
            throw new Error(error.message || 'Failed to create artwork');
          }
          
          const data = await response.json();
          console.log('Artwork created successfully');
          return data;
        } catch (error) {
          console.error('Error creating artwork:', error);
          throw error;
        }
      },
      
      updateArtwork: async (id, artworkData) => {
        console.log(`Updating artwork ${id}:`, artworkData);
        try {
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
            console.error(`Failed to update artwork ${id}:`, error);
            throw new Error(error.message || 'Failed to update artwork');
          }
          
          const data = await response.json();
          console.log('Artwork updated successfully');
          return data;
        } catch (error) {
          console.error(`Error updating artwork ${id}:`, error);
          throw error;
        }
      },
      
      deleteArtwork: async (id) => {
        console.log(`Deleting artwork ${id}`);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${baseUrl}/artworks/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to delete artwork ${id}:`, error);
            throw new Error(error.message || 'Failed to delete artwork');
          }
          
          const data = await response.json();
          console.log('Artwork deleted successfully');
          return data;
        } catch (error) {
          console.error(`Error deleting artwork ${id}:`, error);
          throw error;
        }
      }
    };
    
    console.log('ApiProvider initialized successfully');
    return (
      <ApiContext.Provider value={{ api }}>
        {children}
      </ApiContext.Provider>
    );
  } catch (error) {
    console.error('Error initializing ApiProvider:', error);
    // Return a fallback provider with error state
    return (
      <ApiContext.Provider value={{ 
        api: {}, 
        error: error.message,
        isError: true 
      }}>
        <div style={{color: 'red', padding: '20px'}}>
          Error initializing API: {error.message}
        </div>
        {children}
      </ApiContext.Provider>
    );
  }
}
