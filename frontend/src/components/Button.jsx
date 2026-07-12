import React from 'react';

export const Button = ({
  id,
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger, success
  size = 'md', // sm, md, lg
  disabled = false,
  isLoading = false,
  className = '',
  icon: Icon
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] cursor-pointer hover:shadow-lg";
  
  const variants = {
    primary: "gradient-primary text-white focus:ring-blue-500 shadow-md hover:shadow-premium",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300 border border-slate-200",
    outline: "border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400 hover:border-blue-300",
    danger: "bg-gradient-to-r from-rose-500 to-rose-600 text-white focus:ring-rose-500 shadow-md hover:shadow-premium",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white focus:ring-emerald-500 shadow-md hover:shadow-premium",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};
