import axios from 'axios';

// Create a customized version of axios
const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shared name used by the API modules.
export const apiClient = axiosClient;

// Automatically attach the JWT token to every request if it exists
axiosClient.interceptors.request.use((config) => {
  // Auth endpoints must remain public even when the browser has a stale token.
  // This also avoids sending an old JWT after the signing key is rotated.
  if (
    config.url?.startsWith('/auth/') &&
    !config.url.startsWith('/auth/logout/')
  ) {
    return config;
  }

  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
