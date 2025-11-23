import axios from "axios";
import { getIdToken } from "../auth/authService";

const api = axios.create({
  baseURL: "http://localhost:5001/",
  //headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Request interceptor to include the ID token in the Authorization header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken().catch(() => null); // Safely handle if getIdToken fails
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving ID token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
