// src/api/api.js – Axios instance with auth interceptor
import axios from 'axios';

// All API requests will automatically use this base URL
const API = axios.create({
    baseURL: "http://localhost:3000/api",
  });
  
// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
    // getting from local storage userInfo
    const userInfo = localStorage.getItem('userInfo');

    // Check if userInfo exists
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
    // If token exists, attach it to request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default API;
