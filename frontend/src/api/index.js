// frontend/src/api/index.js - API integratie voor frontend
import axios from 'axios';

// Basis URL voor API requests
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://kunstcollectie.up.railway.app/api'
  : 'http://localhost:3001/api';

// Axios instance met standaard configuratie
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor voor het toevoegen van de auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor voor error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect naar login pagina bij 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Kunstwerken API calls
export const artworksAPI = {
  getAll: () => api.get('/artworks'),
  getById: (id) => api.get(`/artworks/${id}`),
  create: (artworkData) => api.post('/artworks', artworkData),
  update: (id, artworkData) => api.put(`/artworks/${id}`, artworkData),
  delete: (id) => api.delete(`/artworks/${id}`),
  uploadImage: (formData) => api.post('/artworks/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Kunstenaars API calls
export const artistsAPI = {
  getAll: () => api.get('/artists'),
  getById: (id) => api.get(`/artists/${id}`),
  create: (artistData) => api.post('/artists', artistData),
  update: (id, artistData) => api.put(`/artists/${id}`, artistData),
  delete: (id) => api.delete(`/artists/${id}`),
};

// Locaties API calls
export const locationsAPI = {
  getAll: () => api.get('/locations'),
  getById: (id) => api.get(`/locations/${id}`),
  create: (locationData) => api.post('/locations', locationData),
  update: (id, locationData) => api.put(`/locations/${id}`, locationData),
  delete: (id) => api.delete(`/locations/${id}`),
};

// Kunstwerk types API calls
export const artworkTypesAPI = {
  getAll: () => api.get('/artwork-types'),
  getById: (id) => api.get(`/artwork-types/${id}`),
  create: (typeData) => api.post('/artwork-types', typeData),
  update: (id, typeData) => api.put(`/artwork-types/${id}`, typeData),
  delete: (id) => api.delete(`/artwork-types/${id}`),
};

export default api;
