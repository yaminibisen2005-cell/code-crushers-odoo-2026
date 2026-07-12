import React, { useState, useEffect } from 'react';
import { VtrackoraLogo, VtrackoraLogoIcon } from './VtrackoraLogo';

export const SplashScreen = ({ onComplete, duration = 2500 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 transition-opacity duration-500 ${
      isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-slide-up">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full blur-3xl opacity-30 animate-pulse-glow"></div>
          <VtrackoraLogoIcon size="xl" className="relative z-10 animate-float" />
        </div>

        {/* Brand Name */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">
            VTRACKORA
          </h1>
          <p className="text-sm font-semibold text-blue-300 uppercase tracking-widest">
            AI-Powered Logistics
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-xs text-slate-400 font-medium">Initializing platform...</p>
        </div>

        {/* Tagline */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            TRACK · MONITOR · DELIVER
          </p>
        </div>
      </div>
    </div>
  );
};

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full blur-xl opacity-30 animate-pulse-glow"></div>
        <VtrackoraLogoIcon size="md" className="relative z-10 animate-spin-slow" />
      </div>
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
};

export const InlineLoader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${sizes[size] || sizes.md}`}>
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
