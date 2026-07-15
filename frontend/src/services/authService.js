import api from './api';
import { ROLES } from '../config/roles';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      // Store token and user data (backend returns token, name, email, role)
      const user = {
        name: data.name,
        email: data.email,
        role: data.role
      };

      localStorage.setItem('transitops_token', data.token);
      localStorage.setItem('transitops_user', JSON.stringify(user));

      return {
        token: data.token,
        user: user,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  },
  
  register: async (userData) => {
    try {
      // Map frontend fields to backend fields
      const backendData = {
        name: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      };
      const response = await api.post('/auth/register', backendData);
      
      // Backend returns User object (id, name, email, password, role)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('transitops_user');
    return user ? JSON.parse(user) : null;
  },
  
  logout: () => {
    localStorage.removeItem('transitops_user');
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_role');
  }
};
