import React from 'react';

export const Input = ({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`block w-full rounded-xl border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
            Icon ? 'pl-11' : ''
          } ${
            error
              ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/50'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-slate-300'
          } ${disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white'} ${
            !disabled && 'hover:shadow-md'
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600 font-medium flex items-center gap-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
