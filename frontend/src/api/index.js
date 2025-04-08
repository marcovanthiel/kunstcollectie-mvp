// API functions for the Kunstcollectie application

/**
 * Login function to authenticate users
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Response with success status and user data or error message
 */
export const login = async (email, password) => {
  try {
    // In a real implementation, this would make an API call to the backend
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
      
      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login mislukt. Controleer uw gegevens.',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het inloggen. Probeer het later opnieuw.',
    };
  }
};

/**
 * Logout function to end user session
 * @returns {Promise<Object>} - Response with success status
 */
export const logout = async () => {
  try {
    // In a real implementation, this would make an API call to the backend
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
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove token even if API call fails
    localStorage.removeItem('token');
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het uitloggen.',
    };
  }
};

/**
 * Get artworks from the API
 * @returns {Promise<Object>} - Response with success status and artworks data
 */
export const getArtworks = async () => {
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
      return {
        success: false,
        message: data.message || 'Kon kunstwerken niet laden.',
      };
    }
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van kunstwerken.',
    };
  }
};
