import React from 'react';
import { useApp } from '../context/AppContext';
import { ROLES } from '../config/roles';
import { FleetManagerDashboard } from './dashboard/FleetManagerDashboard';
import { DispatcherDashboard } from './dashboard/DispatcherDashboard';
import { SafetyOfficerDashboard } from './dashboard/SafetyOfficerDashboard';
import { FinancialAnalystDashboard } from './dashboard/FinancialAnalystDashboard';

export const Dashboard = () => {
  const { user } = useApp();

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (user?.role) {
      case ROLES.FLEET_MANAGER:
        return <FleetManagerDashboard />;
      case ROLES.DISPATCHER:
        return <DispatcherDashboard />;
      case ROLES.SAFETY_OFFICER:
        return <SafetyOfficerDashboard />;
      case ROLES.FINANCIAL_ANALYST:
        return <FinancialAnalystDashboard />;
      default:
        return <FleetManagerDashboard />; // Default fallback
    }
  };

  return renderDashboard();
};
