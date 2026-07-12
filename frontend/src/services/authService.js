import api from './api';
import { ROLES } from '../config/roles';

// Demo users with roles for testing
const DEMO_USERS = {
  'admin@vtrackora.com': {
    password: 'admin123',
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@vtrackora.com',
      role: ROLES.FLEET_MANAGER,
      avatar: 'https://i.pravatar.cc/150?img=68'
    }
  },
  'dispatcher@vtrackora.com': {
    password: 'dispatcher123',
    user: {
      id: 2,
      name: 'John Dispatcher',
      email: 'dispatcher@vtrackora.com',
      role: ROLES.DISPATCHER,
      avatar: 'https://i.pravatar.cc/150?img=33'
    }
  },
  'safety@vtrackora.com': {
    password: 'safety123',
    user: {
      id: 3,
      name: 'Sarah Safety',
      email: 'safety@vtrackora.com',
      role: ROLES.SAFETY_OFFICER,
      avatar: 'https://i.pravatar.cc/150?img=44'
    }
  },
  'finance@vtrackora.com': {
    password: 'finance123',
    user: {
      id: 4,
      name: 'Mike Finance',
      email: 'finance@vtrackora.com',
      role: ROLES.FINANCIAL_ANALYST,
      avatar: 'https://i.pravatar.cc/150?img=12'
    }
  }
};

// Helper to get registered users from localStorage
const getRegisteredUsers = () => {
  const users = localStorage.getItem('vtrackora_registered_users');
  return users ? JSON.parse(users) : {};
};

// Helper to save registered users to localStorage
const saveRegisteredUsers = (users) => {
  localStorage.setItem('vtrackora_registered_users', JSON.stringify(users));
};

export const authService = {
  login: async (email, password) => {
    // First check demo users
    const demoUser = DEMO_USERS[email];
    
    if (demoUser && demoUser.password === password) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: demoUser.user
      };
    }
    
    // Then check registered users
    const registeredUsers = getRegisteredUsers();
    const registeredUser = registeredUsers[email];
    
    if (registeredUser && registeredUser.password === password) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: registeredUser.user
      };
    }
    
    // If no local user matches, try the actual API (for future Spring Boot integration)
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },
  
  register: async (userData) => {
    const { fullName, email, phone, role, password } = userData;
    
    // Check if user already exists
    const registeredUsers = getRegisteredUsers();
    if (registeredUsers[email] || DEMO_USERS[email]) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name: fullName,
      email,
      phone,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    };
    
    // Store user with password
    registeredUsers[email] = {
      password,
      user: newUser
    };
    
    saveRegisteredUsers(registeredUsers);
    
    // For future API integration
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      // If API fails, we still have local storage fallback
      console.log('API registration failed, using local storage');
    }
    
    return { success: true, user: newUser };
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('vtrackora_user');
    return user ? JSON.parse(user) : null;
  },
  
  logout: () => {
    localStorage.removeItem('vtrackora_user');
    localStorage.removeItem('vtrackora_token');
    localStorage.removeItem('vtrackora_role');
  }
};
