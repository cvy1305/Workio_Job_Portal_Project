import axios from "axios";

// Create a centralized axios instance with pre-configured settings
// This avoids repeating baseURL and withCredentials in every API call
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
  withCredentials: true, // Always send cookies with requests
});

export default axiosInstance;

