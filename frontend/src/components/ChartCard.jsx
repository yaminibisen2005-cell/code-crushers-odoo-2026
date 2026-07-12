import React from 'react';

export const ChartCard = ({
  title,
  subtitle,
  actions,
  children,
  className = ""
}) => {
  return (
    <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-slate-800 leading-none">{title}</h4>
          {subtitle && <span className="text-xs text-slate-400 mt-1">{subtitle}</span>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 w-full min-h-[240px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
