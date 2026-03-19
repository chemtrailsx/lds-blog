import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// We set the token dynamically via setClerkToken (called from App.jsx)
let clerkTokenGetter = null;

export function setClerkToken(getToken) {
  clerkTokenGetter = getToken;
}

api.interceptors.request.use(async (config) => {
  if (clerkTokenGetter) {
    try {
      const token = await clerkTokenGetter();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Not signed in — that's fine for public endpoints
    }
  }
  return config;
});

export default api;
