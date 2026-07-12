import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLoader } from './components/common/AppLoader';
import { AnimatePresence } from 'framer-motion';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Vehicles } from './pages/Vehicles';
import { Drivers } from './pages/Drivers';
import { Trips } from './pages/Trips';
import { Maintenance } from './pages/Maintenance';
import { FuelExpense } from './pages/FuelExpense';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { AccessDenied } from './pages/AccessDenied';

// Authentication Guard Component
const AuthGuard = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

// App Wrapper with Loader
const AppContent = () => {
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <AppLoader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>
      {!showLoader && (
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Access Denied Route */}
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Protected Dashboard Panel Routes with Role-Based Access */}
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="dashboard">
                  <Dashboard />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />
          <Route 
            path="/vehicles" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="vehicles">
                  <Vehicles />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />
          <Route 
            path="/drivers" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="drivers">
                  <Drivers />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />
          <Route 
            path="/trips" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="trips">
                  <Trips />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />
          <Route 
            path="/maintenance" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="maintenance">
                  <Maintenance />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />
          <Route 
            path="/fuel" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="fuel">
                  <FuelExpense />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="reports">
                  <Reports />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AuthGuard>
                <ProtectedRoute requiredPage="settings">
                  <Settings />
                </ProtectedRoute>
              </AuthGuard>
            } 
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<AuthGuard><NotFound /></AuthGuard>} />
        </Routes>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
