import React from 'react';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  title,
  onClose,
  children,
  width = 'max-w-md' // max-w-sm, md, lg, xl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        {/* Panel */}
        <div className={`w-screen ${width} bg-white shadow-2xl border-l border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0 z-50`}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
