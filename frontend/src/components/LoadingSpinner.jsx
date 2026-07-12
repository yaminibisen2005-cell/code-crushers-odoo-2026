import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <div className={`animate-spin rounded-full border-t-[#0F6FFF] border-slate-200 ${sizes[size]}`}></div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full border border-[#E5EEF8] rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
      <div className="bg-[#F7FAFC] border-b border-[#E5EEF8] h-12 flex items-center px-6">
        <div className="w-1/4 h-4 bg-slate-200 rounded"></div>
      </div>
      <div className="divide-y divide-[#E5EEF8]">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="h-16 flex items-center justify-between px-6">
            <div className="w-1/3 h-4 bg-slate-100 rounded"></div>
            <div className="w-1/6 h-4 bg-slate-100 rounded"></div>
            <div className="w-1/12 h-4 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="border border-[#E5EEF8] rounded-2xl p-5 bg-white shadow-sm animate-pulse flex flex-col gap-3">
      <div className="w-1/3 h-3 bg-slate-200 rounded"></div>
      <div className="w-1/2 h-8 bg-slate-300 rounded"></div>
      <div className="w-2/3 h-3 bg-slate-100 rounded"></div>
    </div>
  );
};
