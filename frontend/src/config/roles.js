// Role Constants
export const ROLES = {
  FLEET_MANAGER: 'FLEET_MANAGER',
  DISPATCHER: 'DISPATCHER',
  SAFETY_OFFICER: 'SAFETY_OFFICER',
  FINANCIAL_ANALYST: 'FINANCIAL_ANALYST'
};

// Role Display Names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.FLEET_MANAGER]: 'Fleet Manager',
  [ROLES.DISPATCHER]: 'Dispatcher',
  [ROLES.SAFETY_OFFICER]: 'Safety Officer',
  [ROLES.FINANCIAL_ANALYST]: 'Financial Analyst'
};

// Route/Page Permissions by Role
export const ROLE_PERMISSIONS = {
  [ROLES.FLEET_MANAGER]: [
    'dashboard',
    'vehicles',
    'maintenance',
    'fuel',
    'reports',
    'settings'
  ],
  [ROLES.DISPATCHER]: [
    'dashboard',
    'trips'
  ],
  [ROLES.SAFETY_OFFICER]: [
    'dashboard',
    'drivers'
  ],
  [ROLES.FINANCIAL_ANALYST]: [
    'dashboard',
    'fuel',
    'reports'
  ]
};

// Check if a role has access to a specific page/route
export const hasAccess = (role, page) => {
  if (!role || !page) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(page);
};

// Get all accessible pages for a role
export const getAccessiblePages = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
