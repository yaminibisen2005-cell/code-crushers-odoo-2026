import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { driverService } from '../../services/driverService';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import {
  Users,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  UserCheck
} from 'lucide-react';

export const SafetyOfficerDashboard = () => {
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const data = await driverService.getAllDrivers();
        setDrivers(data);
      } catch (err) {
        showError('Could not retrieve driver data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="h-80 bg-white border rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const activeDrivers = drivers.filter(d => d.status === 'Active');
  const suspendedDrivers = drivers.filter(d => d.status === 'Suspended');
  const expiringLicenses = drivers.filter(d => {
    const expiryDate = new Date(d.licenseExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Safety Officer KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Drivers"
          value={activeDrivers.length}
          subtitle="Currently on duty"
          color="green"
          icon={UserCheck}
        />
        <StatCard
          title="Suspended Drivers"
          value={suspendedDrivers.length}
          subtitle="Under review"
          color="red"
          icon={ShieldAlert}
        />
        <StatCard
          title="License Expiring"
          value={expiringLicenses.length}
          subtitle="Within 30 days"
          color="amber"
          icon={AlertTriangle}
        />
        <StatCard
          title="Avg Safety Score"
          value="92%"
          subtitle="Fleet average"
          color="blue"
          icon={Award}
          trend={{ type: 'up', text: '+3%' }}
        />
      </div>

      {/* License Expiry Alerts */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">License Expiry Alerts</h3>
            <p className="text-xs text-slate-400 mt-1">Drivers with licenses expiring soon</p>
          </div>
          <StatusBadge status="Warning" />
        </div>
        
        {expiringLicenses.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Expiring Licenses"
            description="All driver licenses are valid."
          />
        ) : (
          <div className="space-y-3">
            {expiringLicenses.slice(0, 5).map((driver) => {
              const expiryDate = new Date(driver.licenseExpiry);
              const today = new Date();
              const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={driver.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{driver.name}</p>
                      <p className="text-xs text-slate-500">License: {driver.licenseNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysUntilExpiry} days
                    </span>
                    <StatusBadge status="Warning" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Driver Status Overview */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Driver Status Overview</h3>
            <p className="text-xs text-slate-400 mt-1">Current status of all drivers</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {drivers.slice(0, 5).map((driver) => (
            <div key={driver.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{driver.name}</p>
                  <p className="text-xs text-slate-500">Safety Score: {driver.safetyScore || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}
                </span>
                <StatusBadge status={driver.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
