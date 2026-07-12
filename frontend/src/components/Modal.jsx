import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  maxWidth = 'max-w-lg', // max-w-sm, md, lg, xl, 2xl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Box */}
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100 z-50 flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1 text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
};
