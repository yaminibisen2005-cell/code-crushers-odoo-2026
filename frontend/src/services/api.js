import axios from "axios";

// Create Axios instance for real backend communication
// Using relative path since Vite proxy handles the backend connection
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("transitops_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("transitops_token");
      localStorage.removeItem("transitops_user");
    }

    return Promise.reject(error);
  },
);

export default api;
