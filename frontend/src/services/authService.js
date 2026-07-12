import api from './api';
import { ROLES } from '../config/roles';

// Demo users with roles for testing
const DEMO_USERS = {
  'admin@transitops.com': {
    password: 'admin123',
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@transitops.com',
      role: ROLES.FLEET_MANAGER,
      avatar: 'https://i.pravatar.cc/150?img=68'
    }
  },
  'dispatcher@transitops.com': {
    password: 'dispatcher123',
    user: {
      id: 2,
      name: 'John Dispatcher',
      email: 'dispatcher@transitops.com',
      role: ROLES.DISPATCHER,
      avatar: 'https://i.pravatar.cc/150?img=33'
    }
  },
  'safety@transitops.com': {
    password: 'safety123',
    user: {
      id: 3,
      name: 'Sarah Safety',
      email: 'safety@transitops.com',
      role: ROLES.SAFETY_OFFICER,
      avatar: 'https://i.pravatar.cc/150?img=44'
    }
  },
  'finance@transitops.com': {
    password: 'finance123',
    user: {
      id: 4,
      name: 'Mike Finance',
      email: 'finance@transitops.com',
      role: ROLES.FINANCIAL_ANALYST,
      avatar: 'https://i.pravatar.cc/150?img=12'
    }
  }
};

export const authService = {
  login: async (email, password) => {
    // For demo purposes, use mock authentication
    // In production, this would call the actual API
    const demoUser = DEMO_USERS[email];
    
    if (demoUser && demoUser.password === password) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: demoUser.user
      };
    }
    
    // If no demo user matches, try the actual API
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error('Invalid credentials');
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
