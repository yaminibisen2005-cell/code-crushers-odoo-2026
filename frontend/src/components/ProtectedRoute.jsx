import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { hasAccess } from '../config/roles';

export const ProtectedRoute = ({ children, requiredPage }) => {
  const { user } = useApp();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to the required page
  if (requiredPage && !hasAccess(user.role, requiredPage)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};
