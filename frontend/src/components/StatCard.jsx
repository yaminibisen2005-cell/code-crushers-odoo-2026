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
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    green: "bg-emerald-50 border-emerald-100 text-emerald-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    red: "bg-red-50 border-red-100 text-red-600",
    slate: "bg-slate-50 border-slate-100 text-slate-600",
  };

  const ringColors = {
    blue: "border-blue-50 focus-within:ring-blue-100",
    green: "border-emerald-50 focus-within:ring-emerald-100",
    amber: "border-amber-50 focus-within:ring-amber-100",
    red: "border-red-50 focus-within:ring-red-100",
    slate: "border-slate-50 focus-within:ring-slate-100",
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group ${
        onClick ? 'cursor-pointer active:scale-98' : ''
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-500 transition-colors">
          {title}
        </span>
        <span className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500">
            {subtitle}
          </span>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
              trend.type === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {trend.type === 'up' ? '▲' : '▼'} {trend.text}
            </span>
            <span className="text-[10px] text-slate-400">vs last week</span>
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
