import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue', // blue, green, amber, red, slate, violet, rose
  trend, // { type: 'up' | 'down', text: string }
  onClick,
  id,
  gradient = false
}) => {
  const colors = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-600",
      iconBg: "bg-blue-500",
      iconText: "text-white",
      gradient: "from-blue-500 to-blue-600"
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      border: "border-emerald-200",
      text: "text-emerald-600",
      iconBg: "bg-emerald-500",
      iconText: "text-white",
      gradient: "from-emerald-500 to-emerald-600"
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      border: "border-amber-200",
      text: "text-amber-600",
      iconBg: "bg-amber-500",
      iconText: "text-white",
      gradient: "from-amber-500 to-amber-600"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-rose-100",
      border: "border-red-200",
      text: "text-red-600",
      iconBg: "bg-red-500",
      iconText: "text-white",
      gradient: "from-red-500 to-rose-600"
    },
    slate: {
      bg: "bg-gradient-to-br from-slate-50 to-slate-100",
      border: "border-slate-200",
      text: "text-slate-600",
      iconBg: "bg-slate-500",
      iconText: "text-white",
      gradient: "from-slate-500 to-slate-600"
    },
    violet: {
      bg: "bg-gradient-to-br from-violet-50 to-violet-100",
      border: "border-violet-200",
      text: "text-violet-600",
      iconBg: "bg-violet-500",
      iconText: "text-white",
      gradient: "from-violet-500 to-violet-600"
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-50 to-rose-100",
      border: "border-rose-200",
      text: "text-rose-600",
      iconBg: "bg-rose-500",
      iconText: "text-white",
      gradient: "from-rose-500 to-rose-600"
    }
  };

  const colorConfig = colors[color] || colors.blue;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`glass-card ${colorConfig.bg} ${colorConfig.border} rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 flex items-center justify-between group hover-lift relative overflow-hidden ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      }`}
    >
      {/* Subtle gradient accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorConfig.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-600 transition-colors">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500 font-medium">
            {subtitle}
          </span>
        )}
        {trend && (
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm ${
              trend.type === 'up' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {trend.type === 'up' ? '↑' : '↓'} {trend.text}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">vs last week</span>
          </div>
        )}
      </div>
      
      {Icon && (
        <div className={`p-4 rounded-xl ${colorConfig.iconBg} ${colorConfig.iconText} shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative z-10`}>
          <Icon className="w-7 h-7" />
        </div>
      )}
    </div>
  );
};
