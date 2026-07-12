import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const normalized = status?.toLowerCase() || '';

  const styles = {
    // Vehicles / Drivers
    available: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
    'on trip': "bg-[#0F6FFF]/10 text-[#0F6FFF] border-[#0F6FFF]/30",
    ontrip: "bg-[#0F6FFF]/10 text-[#0F6FFF] border-[#0F6FFF]/30",
    dispatched: "bg-[#0F6FFF]/10 text-[#0F6FFF] border-[#0F6FFF]/30",
    'in shop': "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
    inshop: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
    retired: "bg-slate-100 text-slate-600 border-slate-200",
    suspended: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
    
    // Trips
    completed: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",

    // Maintenance / Other
    'in progress': "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
    inprogress: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
    pending: "bg-purple-50 text-purple-700 border-purple-200"
  };

  const currentStyle = styles[normalized] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        normalized === 'available' || normalized === 'completed' ? 'bg-[#22C55E]' :
        normalized === 'on trip' || normalized === 'ontrip' || normalized === 'dispatched' ? 'bg-[#0F6FFF]' :
        normalized === 'in shop' || normalized === 'inshop' || normalized === 'in progress' || normalized === 'inprogress' ? 'bg-[#F59E0B]' :
        normalized === 'suspended' || normalized === 'cancelled' ? 'bg-[#EF4444]' : 'bg-slate-400'
      }`}></span>
      {status}
    </span>
  );
};
