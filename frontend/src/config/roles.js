// Role Constants
export const ROLES = {
  FLEET_MANAGER: "FLEET_MANAGER",
  DISPATCHER: "DISPATCHER",
  DRIVER: "DRIVER",
  SAFETY_OFFICER: "SAFETY_OFFICER",
  FINANCIAL_ANALYST: "FINANCIAL_ANALYST",
};

export const normalizeRole = (role) => {
  if (!role) return null;

  const normalized = String(role).trim().toUpperCase().replace(/\s+/g, "_");

  switch (normalized) {
    case ROLES.FLEET_MANAGER:
    case "FLEET MANAGER":
      return ROLES.FLEET_MANAGER;
    case ROLES.DISPATCHER:
    case "DISPATCHER":
      return ROLES.DISPATCHER;
    case ROLES.DRIVER:
    case "DRIVER":
      return ROLES.DRIVER;
    case ROLES.SAFETY_OFFICER:
    case "SAFETY OFFICER":
      return ROLES.SAFETY_OFFICER;
    case ROLES.FINANCIAL_ANALYST:
    case "FINANCIAL ANALYST":
      return ROLES.FINANCIAL_ANALYST;
    default:
      return normalized;
  }
};

// Role Display Names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.FLEET_MANAGER]: "Fleet Manager",
  [ROLES.DISPATCHER]: "Dispatcher",
  [ROLES.DRIVER]: "Driver",
  [ROLES.SAFETY_OFFICER]: "Safety Officer",
  [ROLES.FINANCIAL_ANALYST]: "Financial Analyst",
};

// Route/Page Permissions by Role
export const ROLE_PERMISSIONS = {
  [ROLES.FLEET_MANAGER]: [
    "dashboard",
    "vehicles",
    "maintenance",
    "fuel",
    "reports",
    "settings",
  ],
  [ROLES.DISPATCHER]: ["dashboard", "trips"],
  [ROLES.DRIVER]: ["dashboard"],
  [ROLES.SAFETY_OFFICER]: ["dashboard", "drivers"],
  [ROLES.FINANCIAL_ANALYST]: ["dashboard", "fuel", "reports"],
};

// Check if a role has access to a specific page/route
export const hasAccess = (role, page) => {
  if (!role || !page) return false;
  const normalizedRole = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
  return permissions.includes(page);
};

// Get all accessible pages for a role
export const getAccessiblePages = (role) => {
  const normalizedRole = normalizeRole(role);
  return ROLE_PERMISSIONS[normalizedRole] || [];
};
