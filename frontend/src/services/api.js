import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Image API
export const imageAPI = {
  processImages: (formData) => 
    api.post('/images/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  downloadImage: (filename) => 
    api.get(`/images/download/${filename}`, {
      responseType: 'blob',
    }),
  
  downloadAllAsZip: (filenames) =>
    api.post('/images/download-zip', { filenames }, {
      responseType: 'blob',
    }),
  
  deleteFiles: (filenames) =>
    api.delete('/images/delete', { data: { filenames } }),
};

export default api;

