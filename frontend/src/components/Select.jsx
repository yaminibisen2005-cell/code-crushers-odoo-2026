import React from 'react';

export const Select = ({
  id,
  label,
  name,
  value,
  onChange,
  options = [], // [{ value, label, disabled, disabledReason }]
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
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
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm appearance-none pr-11 cursor-pointer hover:border-slate-300 hover:shadow-md ${
            error ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/50' : ''
          } ${disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value} disabled={opt.disabled}>
              {opt.label} {opt.disabled && opt.disabledReason ? `(${opt.disabledReason})` : ''}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-rose-600 font-medium flex items-center gap-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
