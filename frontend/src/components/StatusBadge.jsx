import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const normalized = status?.toLowerCase() || '';

  const styles = {
    // Vehicles / Drivers
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    'on trip': "bg-blue-50 text-blue-700 border-blue-200",
    ontrip: "bg-blue-50 text-blue-700 border-blue-200",
    dispatched: "bg-blue-50 text-blue-700 border-blue-200",
    'in shop': "bg-amber-50 text-amber-700 border-amber-200",
    inshop: "bg-amber-50 text-amber-700 border-amber-200",
    retired: "bg-slate-100 text-slate-600 border-slate-200",
    suspended: "bg-red-50 text-red-700 border-red-200",
    
    // Trips
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",

    // Maintenance / Other
    'in progress': "bg-amber-50 text-amber-700 border-amber-200",
    inprogress: "bg-amber-50 text-amber-700 border-amber-200",
    pending: "bg-purple-50 text-purple-700 border-purple-200"
  };

  const currentStyle = styles[normalized] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        normalized === 'available' || normalized === 'completed' ? 'bg-emerald-500' :
        normalized === 'on trip' || normalized === 'ontrip' || normalized === 'dispatched' ? 'bg-blue-500' :
        normalized === 'in shop' || normalized === 'inshop' || normalized === 'in progress' || normalized === 'inprogress' ? 'bg-amber-500' :
        normalized === 'suspended' || normalized === 'cancelled' ? 'bg-red-500' : 'bg-slate-400'
      }`}></span>
      {status}
    </span>
  );
};
