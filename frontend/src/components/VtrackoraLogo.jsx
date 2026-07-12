import React from 'react';

export const VtrackoraLogo = ({ size = 'md', showTagline = false, className = '' }) => {
  const sizes = {
    sm: { width: 32, height: 32, text: 'text-lg' },
    md: { width: 40, height: 40, text: 'text-xl' },
    lg: { width: 48, height: 48, text: 'text-2xl' }
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative" style={{ width: sizeConfig.width, height: sizeConfig.height }}>
        {/* Track/Path Element */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer track ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#trackGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="8 4"
          />
          
          {/* Inner track ring */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="url(#trackGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* V and T Letters */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            {/* V Letter */}
            <span 
              className="font-extrabold text-blue-600 leading-none"
              style={{ 
                fontSize: size === 'sm' ? '18px' : size === 'md' ? '22px' : '28px',
                textShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
              }}
            >
              V
            </span>
            {/* T Letter */}
            <span 
              className="font-extrabold text-emerald-600 leading-none"
              style={{ 
                fontSize: size === 'sm' ? '18px' : size === 'md' ? '22px' : '28px',
                textShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
              }}
            >
              T
            </span>
          </div>
        </div>
        
        {/* Map Pin Icon */}
        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full p-1 shadow-lg">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
      
      {/* Brand Name and Tagline */}
      <div className="flex flex-col">
        <span className={`font-bold text-slate-900 tracking-tight leading-none ${sizeConfig.text}`}>
          VTRACKORA
        </span>
        {showTagline && (
          <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest mt-1">
            TRACK · MONITOR · DELIVER
          </span>
        )}
      </div>
    </div>
  );
};

export const VtrackoraLogoIcon = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 24,
    md: 32,
    lg: 40
  };

  const iconSize = sizes[size] || sizes.md;

  return (
    <div className={`relative ${className}`} style={{ width: iconSize, height: iconSize }}>
      {/* Track/Path Element */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer track ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#trackGradientIcon)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 4"
        />
        
        {/* Inner track ring */}
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="url(#trackGradientIcon)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 2"
          opacity="0.6"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="trackGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* V and T Letters */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-0.5">
          <span 
            className="font-extrabold text-blue-600 leading-none"
            style={{ 
              fontSize: iconSize * 0.55,
              textShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
            }}
          >
            V
          </span>
          <span 
            className="font-extrabold text-emerald-600 leading-none"
            style={{ 
              fontSize: iconSize * 0.55,
              textShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
            }}
          >
            T
          </span>
        </div>
      </div>
      
      {/* Map Pin Icon */}
      <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full p-1 shadow-lg">
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="w-3 h-3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  );
};
