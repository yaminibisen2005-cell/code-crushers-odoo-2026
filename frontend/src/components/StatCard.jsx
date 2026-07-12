import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue', // blue, green, amber, red, slate
  trend, // { type: 'up' | 'down', text: string }
  onClick,
  id
}) => {
  const colors = {
    blue: "bg-[#0F6FFF]/10 border-[#0F6FFF]/30 text-[#0F6FFF]",
    green: "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]",
    amber: "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]",
    red: "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]",
    slate: "bg-slate-50 border-slate-100 text-slate-600",
  };

  const ringColors = {
    blue: "border-[#E5EEF8] focus-within:ring-[#0F6FFF]/20",
    green: "border-[#E5EEF8] focus-within:ring-[#22C55E]/20",
    amber: "border-[#E5EEF8] focus-within:ring-[#F59E0B]/20",
    red: "border-[#E5EEF8] focus-within:ring-[#EF4444]/20",
    slate: "border-[#E5EEF8] focus-within:ring-slate-100",
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white border border-[#E5EEF8] rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group ${
        onClick ? 'cursor-pointer active:scale-98' : ''
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] group-hover:text-[#12263F] transition-colors">
          {title}
        </span>
        <span className="text-3xl font-bold text-[#12263F] tracking-tight">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-[#64748B]">
            {subtitle}
          </span>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
              trend.type === 'up' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
            }`}>
              {trend.type === 'up' ? '▲' : '▼'} {trend.text}
            </span>
            <span className="text-[10px] text-[#64748B]">vs last week</span>
          </div>
        )}
      </div>
      
      {Icon && (
        <div className={`p-3.5 rounded-xl border ${colors[color]} shrink-0 transition-all duration-300 group-hover:scale-105`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
