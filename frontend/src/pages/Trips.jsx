import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { tripService } from '../services/tripService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { StatusBadge } from '../components/StatusBadge';
import { CardSkeleton, TableSkeleton } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import {
  Navigation,
  CheckCircle,
  AlertTriangle,
  GitFork,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  XCircle,
  UserCheck,
  Truck,
  ShieldAlert
} from 'lucide-react';

export const Trips = () => {
  const { showSuccess, showError, addNotification } = useApp();
  
  // States
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dispatch Multi-step states
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    distance: ''
  });
  const [stepErrors, setStepErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState([]);
  const [isDispatching, setIsDispatching] = useState(false);

  // Trip List Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load All Resources
  const loadResources = async () => {
    setLoading(true);
    try {
      const [vList, dList, tList] = await Promise.all([
        vehicleService.getAll(),
        driverService.getAll(),
        tripService.getAll()
      ]);
      setVehicles(vList);
      setDrivers(dList);
      setTrips(tList);
    } catch (err) {
      showError('Failed to fetch dispatcher resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Dispatch Action
  const handleDispatch = async () => {
    setIsDispatching(true);
    setBackendErrors([]);
    try {
      const payload = {
        source: formData.source,
        destination: formData.destination,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        cargoWeight: Number(formData.cargoWeight),
        distance: Number(formData.distance)
      };

      await tripService.create(payload);
      showSuccess(`Trip routed from ${formData.source} to ${formData.destination} dispatched!`);
      addNotification(`New trip dispatched: ${formData.source} ➔ ${formData.destination}`);
      
      // Reset Form
      setFormData({
        source: '',
        destination: '',
        vehicleId: '',
        driverId: '',
        cargoWeight: '',
        distance: ''
      });
      setStep(1);
      loadResources();
    } catch (err) {
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'Dispatch rejected by server.'];
      setBackendErrors(errors);
      showError('Dispatch Rejected: Check rule validations.');
    } finally {
      setIsDispatching(false);
    }
  };

  // Move Step 1 -> 2
  const handleStep1Next = () => {
    const errors = {};
    if (!formData.source.trim()) errors.source = 'Source location is required.';
    if (!formData.destination.trim()) errors.destination = 'Destination is required.';
    
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    setStep(2);
  };

  // Move Step 2 -> 3
  const handleStep2Next = () => {
    const errors = {};
    if (!formData.vehicleId) errors.vehicleId = 'Please select a vehicle.';
    if (!formData.driverId) errors.driverId = 'Please select a driver.';
    if (!formData.cargoWeight || Number(formData.cargoWeight) <= 0) {
      errors.cargoWeight = 'Please enter a positive weight payload.';
    }
    if (!formData.distance || Number(formData.distance) <= 0) {
      errors.distance = 'Please enter a positive route distance.';
    }

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    setStep(3);
  };

  const handleUpdateTripStatus = async (tripId, nextStatus) => {
    try {
      await tripService.update(tripId, { status: nextStatus });
      showSuccess(`Trip status updated to ${nextStatus}.`);
      addNotification(`Trip #${tripId.slice(-4)} status modified: ${nextStatus}`);
      loadResources();
    } catch (err) {
      showError('Failed to update trip status.');
    }
  };

  const getVehicleLabel = (vId) => {
    const v = vehicles.find(item => item.id === vId);
    return v ? `${v.name} (${v.registrationNo})` : 'Unknown Vehicle';
  };

  const getDriverLabel = (dId) => {
    const d = drivers.find(item => item.id === dId);
    return d ? d.name : 'Unknown Driver';
  };

  // Pagination slice for Trips
  const filteredTrips = [...trips].reverse(); // Show newest first
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Business Rules Options Mapping
  const TODAY = new Date('2026-07-11');
  const vehicleOptions = [
    { value: '', label: '-- Select Fleet Vehicle --' },
    ...vehicles.map(v => {
      const isDisabled = v.status === 'In Shop' || v.status === 'Retired' || v.status === 'On Trip';
      return {
        value: v.id,
        label: `${v.registrationNo} - ${v.name} (${v.status})`,
        disabled: isDisabled,
        disabledReason: isDisabled ? v.status : null
      };
    })
  ];

  const driverOptions = [
    { value: '', label: '-- Select Operator --' },
    ...drivers.map(d => {
      const isExpired = new Date(d.expiryDate) < TODAY;
      const isSuspended = d.status === 'Suspended';
      const isOnTrip = d.status === 'On Trip';
      const isDisabled = isExpired || isSuspended || isOnTrip;
      
      let reason = null;
      if (isExpired) reason = 'CDL Expired';
      else if (isSuspended) reason = 'Suspended';
      else if (isOnTrip) reason = 'On Trip';

      return {
        value: d.id,
        label: `${d.name} (${d.category})`,
        disabled: isDisabled,
        disabledReason: reason
      };
    })
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in">
      
      {/* LEFT: TRIP DISPATCHER FORM */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <GitFork className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-slate-800">Operational Dispatcher</h3>
              <span className="text-xs text-slate-400">Step-by-step cargo routing planner</span>
            </div>
          </div>

          {/* STEP INDICATORS */}
          <div className="flex items-center justify-between text-xs font-semibold px-2">
            <button 
              onClick={() => step > 1 && setStep(1)}
              className={`flex items-center gap-1.5 cursor-pointer ${step >= 1 ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>1</span>
              <span>Route Plan</span>
            </button>
            <div className="flex-1 h-0.5 bg-slate-100 mx-2"></div>
            <button
              onClick={() => step > 2 && setStep(2)}
              className={`flex items-center gap-1.5 cursor-pointer ${step >= 2 ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}
              disabled={step < 2}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>2</span>
              <span>Scheduling</span>
            </button>
            <div className="flex-1 h-0.5 bg-slate-100 mx-2"></div>
            <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>3</span>
              <span>Review</span>
            </span>
          </div>

          {/* BACKEND VALIDATION ALERT BOXES */}
          {backendErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-800 font-bold">
                <ShieldAlert className="w-4.5 h-4.5 text-red-600" />
                <span>Dispatch Rejected: Core Regulations Failed</span>
              </div>
              <ul className="list-disc pl-5 text-red-700 flex flex-col gap-1 leading-normal">
                {backendErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 1: ROUTE PLAN */}
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <Input
                id="dispatch-src"
                label="Departure Port (Source)"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="City, State (e.g. Houston, TX)"
                error={stepErrors.source}
                required
              />
              <Input
                id="dispatch-dest"
                label="Destination Terminal"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="City, State (e.g. Dallas, TX)"
                error={stepErrors.destination}
                required
              />

              <div className="flex justify-end pt-3">
                <Button onClick={handleStep1Next} variant="primary">
                  Next Step: Assign Assets
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: ASSIGN VEHICLE & DRIVER */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <Select
                id="dispatch-vehicle"
                label="Assign Vehicle"
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                options={vehicleOptions}
                error={stepErrors.vehicleId}
                required
              />

              <Select
                id="dispatch-driver"
                label="Assign Operator"
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                options={driverOptions}
                error={stepErrors.driverId}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="dispatch-cargo"
                  label="Cargo Weight (kg)"
                  type="number"
                  value={formData.cargoWeight}
                  onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                  placeholder="e.g. 12000"
                  error={stepErrors.cargoWeight}
                  required
                />
                <Input
                  id="dispatch-dist"
                  label="Trip Distance (km)"
                  type="number"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="e.g. 240"
                  error={stepErrors.distance}
                  required
                />
              </div>

              <div className="flex justify-between pt-3">
                <Button onClick={() => setStep(1)} variant="outline">
                  Back
                </Button>
                <Button onClick={handleStep2Next} variant="primary">
                  Next Step: Review Detail
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: DISPATCH REVIEW */}
          {step === 3 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 text-xs font-semibold text-slate-600">
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span>Routing:</span>
                  <span className="text-slate-900 font-bold">{formData.source} ➔ {formData.destination}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span>Asset:</span>
                  <span className="text-slate-900 font-bold">{getVehicleLabel(formData.vehicleId)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span>Operator:</span>
                  <span className="text-slate-900 font-bold">{getDriverLabel(formData.driverId)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span>Payload Size:</span>
                  <span className="text-slate-900 font-bold">{Number(formData.cargoWeight).toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="text-slate-900 font-bold">{formData.distance} km</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-700 leading-normal">
                <span className="font-bold block mb-0.5">Pre-Dispatch Clearance</span>
                Dispatched routes instantly lock driver profiles and vehicle registries to "On Trip" availability parameters. Clearances are audited on server entries.
              </div>

              <div className="flex justify-between pt-3">
                <Button onClick={() => setStep(2)} variant="outline">
                  Back
                </Button>
                <Button 
                  onClick={handleDispatch} 
                  variant="primary" 
                  isLoading={isDispatching}
                  className="px-6 shadow-md"
                >
                  Confirm & Dispatch Route
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: LIVE ROUTING MONITOR */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-800">Dispatch Route Monitor</h3>
              <span className="text-xs text-slate-400 mt-1">Live status timeline and complete operations logs</span>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {loading ? (
              <TableSkeleton rows={4} />
            ) : trips.length === 0 ? (
              <EmptyState title="No active routes dispatched" />
            ) : (
              <div className="flex flex-col gap-6">
                {paginatedTrips.map((trip) => (
                  <div key={trip.id} className="border border-slate-100 rounded-2xl p-5 shadow-xs bg-slate-50/40 hover:shadow-md hover:border-slate-200/60 transition-all duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                      <div className="flex items-center gap-2.5 text-slate-800">
                        <MapPin className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                        <span className="font-extrabold text-sm tracking-tight">{trip.source}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-extrabold text-sm tracking-tight">{trip.destination}</span>
                      </div>
                      <StatusBadge status={trip.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-[11px] font-semibold text-slate-500">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-400 text-[10px] uppercase">Vehicle</span>
                        <span className="text-slate-800 font-bold truncate">{getVehicleLabel(trip.vehicleId)}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-400 text-[10px] uppercase">Driver</span>
                        <span className="text-slate-800 font-bold">{getDriverLabel(trip.driverId)}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-400 text-[10px] uppercase">Cargo Payload</span>
                        <span className="text-slate-800 font-bold">{Number(trip.cargoWeight || 0).toLocaleString()} kg</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-400 text-[10px] uppercase">Route Length</span>
                        <span className="text-slate-800 font-bold">{trip.distance} km</span>
                      </div>
                    </div>

                    {/* ROUTE TIMELINE */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="text-slate-300">Timeline:</span>
                        <span className={trip.status === 'Draft' ? 'text-slate-600 underline decoration-slate-400 decoration-2' : ''}>Draft</span>
                        <span className="text-slate-200">➔</span>
                        <span className={trip.status === 'Dispatched' ? 'text-blue-600 underline decoration-blue-500 decoration-2' : ''}>Dispatched</span>
                        <span className="text-slate-200">➔</span>
                        <span className={trip.status === 'Completed' ? 'text-emerald-600 underline decoration-emerald-500 decoration-2' : ''}>Completed</span>
                      </div>

                      {trip.status === 'Dispatched' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleUpdateTripStatus(trip.id, 'Completed')}
                          >
                            Complete Route
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateTripStatus(trip.id, 'Cancelled')}
                            className="hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-slate-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <Pagination
                  currentPage={currentPage}
                  totalItems={trips.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
