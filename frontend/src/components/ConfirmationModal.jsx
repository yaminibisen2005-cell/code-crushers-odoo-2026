import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm to proceed.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger' // danger, warning, primary
}) => {
  if (!isOpen) return null;

  const btnVariants = {
    danger: 'danger',
    warning: 'primary',
    primary: 'primary'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>
      
      {/* Container */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100 animate-fade-in z-50">
        <div className="p-6">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4 items-start">
            <div className={`p-3 rounded-xl ${
              variant === 'danger' ? 'bg-red-50 text-red-600 border border-red-100' :
              variant === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
              'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <h3 className="text-lg font-bold text-slate-900 leading-6">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mt-1">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button 
            variant={btnVariants[variant]} 
            onClick={onConfirm} 
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
