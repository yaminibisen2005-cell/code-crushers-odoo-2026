import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { tripService } from '../../services/tripService';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import {
  Navigation,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  User,
  Truck
} from 'lucide-react';

export const DispatcherDashboard = () => {
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const data = await tripService.getAllTrips();
        setTrips(data);
      } catch (err) {
        showError('Could not retrieve trip data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
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

  const activeTrips = trips.filter(t => t.status === 'In Progress');
  const pendingTrips = trips.filter(t => t.status === 'Pending');
  const completedTrips = trips.filter(t => t.status === 'Completed');

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Dispatcher KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Trips"
          value={activeTrips.length}
          subtitle="Currently in progress"
          color="blue"
          icon={Navigation}
          trend={{ type: 'up', text: 'Live' }}
        />
        <StatCard
          title="Pending Trips"
          value={pendingTrips.length}
          subtitle="Awaiting dispatch"
          color="amber"
          icon={Clock}
        />
        <StatCard
          title="Completed Today"
          value={completedTrips.filter(t => {
            const today = new Date().toDateString();
            return new Date(t.createdAt).toDateString() === today;
          }).length}
          subtitle="Successfully delivered"
          color="green"
          icon={CheckCircle2}
        />
        <StatCard
          title="Dispatch Queue"
          value={pendingTrips.length}
          subtitle="Ready to assign"
          color="purple"
          icon={Truck}
        />
      </div>

      {/* Active Trips */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Active Trips</h3>
            <p className="text-xs text-slate-400 mt-1">Currently in progress</p>
          </div>
        </div>
        
        {activeTrips.length === 0 ? (
          <EmptyState
            icon={Navigation}
            title="No Active Trips"
            description="There are no trips currently in progress."
          />
        ) : (
          <div className="space-y-3">
            {activeTrips.slice(0, 5).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{trip.origin} → {trip.destination}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {trip.vehicleId}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {trip.driverId}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={trip.status} />
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {trip.estimatedDuration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Trips / Dispatch Queue */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Dispatch Queue</h3>
            <p className="text-xs text-slate-400 mt-1">Trips awaiting vehicle and driver assignment</p>
          </div>
        </div>
        
        {pendingTrips.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Dispatch Queue Empty"
            description="All trips have been dispatched."
          />
        ) : (
          <div className="space-y-3">
            {pendingTrips.slice(0, 5).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{trip.origin} → {trip.destination}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(trip.scheduledDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {trip.distance} km
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status="Pending" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
