import {
  LayoutDashboard,
  Truck,
  Users,
  GitFork,
  Wrench,
  Fuel,
  TrendingUp,
  Settings as SettingsIcon
} from 'lucide-react';
import { ROLES } from './roles';

// Base menu items configuration
export const MENU_ITEMS = {
  dashboard: {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    page: 'dashboard'
  },
  vehicles: {
    name: 'Vehicles',
    path: '/vehicles',
    icon: Truck,
    page: 'vehicles'
  },
  drivers: {
    name: 'Drivers',
    path: '/drivers',
    icon: Users,
    page: 'drivers'
  },
  trips: {
    name: 'Trips',
    path: '/trips',
    icon: GitFork,
    page: 'trips'
  },
  maintenance: {
    name: 'Maintenance',
    path: '/maintenance',
    icon: Wrench,
    page: 'maintenance'
  },
  fuel: {
    name: 'Fuel & Expenses',
    path: '/fuel',
    icon: Fuel,
    page: 'fuel'
  },
  reports: {
    name: 'Reports',
    path: '/reports',
    icon: TrendingUp,
    page: 'reports'
  },
  settings: {
    name: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
    page: 'settings'
  }
};

// Role-based menu configurations
export const ROLE_MENUS = {
  [ROLES.FLEET_MANAGER]: [
    MENU_ITEMS.dashboard,
    MENU_ITEMS.vehicles,
    MENU_ITEMS.maintenance,
    MENU_ITEMS.fuel,
    MENU_ITEMS.reports,
    MENU_ITEMS.settings
  ],
  
  [ROLES.DISPATCHER]: [
    MENU_ITEMS.dashboard,
    MENU_ITEMS.trips
  ],
  
  [ROLES.SAFETY_OFFICER]: [
    MENU_ITEMS.dashboard,
    MENU_ITEMS.drivers
  ],
  
  [ROLES.FINANCIAL_ANALYST]: [
    MENU_ITEMS.dashboard,
    MENU_ITEMS.fuel,
    MENU_ITEMS.reports
  ]
};

// Get menu items for a specific role
export const getMenuForRole = (role) => {
  return ROLE_MENUS[role] || [];
};
