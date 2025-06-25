import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Adjust if hosted elsewhere
  withCredentials: true, // Important for cookies if you ever use them
});

// Automatically attach token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
