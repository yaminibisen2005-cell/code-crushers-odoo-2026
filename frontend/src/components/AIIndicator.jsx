import React from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';

export const AIIndicator = ({
  type = 'badge', // badge, icon, text, full
  size = 'sm', // sm, md, lg
  variant = 'primary', // primary, secondary, accent
  label = 'AI-Powered',
  showPulse = true,
  className = ''
}) => {
  const sizes = {
    sm: {
      badge: 'px-2 py-0.5 text-[10px]',
      icon: 'w-4 h-4',
      text: 'text-xs',
      full: 'px-3 py-1.5 text-xs'
    },
    md: {
      badge: 'px-2.5 py-1 text-[11px]',
      icon: 'w-5 h-5',
      text: 'text-sm',
      full: 'px-4 py-2 text-sm'
    },
    lg: {
      badge: 'px-3 py-1.5 text-xs',
      icon: 'w-6 h-6',
      text: 'text-base',
      full: 'px-5 py-2.5 text-base'
    }
  };

  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-blue-500 to-violet-500',
      text: 'text-white',
      border: 'border-blue-400',
      icon: 'text-blue-500'
    },
    secondary: {
      bg: 'bg-gradient-to-r from-slate-600 to-slate-700',
      text: 'text-white',
      border: 'border-slate-500',
      icon: 'text-slate-600'
    },
    accent: {
      bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      text: 'text-white',
      border: 'border-emerald-400',
      icon: 'text-emerald-500'
    }
  };

  const sizeConfig = sizes[size] || sizes.sm;
  const variantConfig = variants[variant] || variants.primary;

  const icons = {
    sparkles: Sparkles,
    brain: Brain,
    zap: Zap
  };

  const IconComponent = icons.sparkles;

  if (type === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${variantConfig.bg} ${variantConfig.text} ${sizeConfig.badge} rounded-full font-bold uppercase tracking-wider shadow-md ${showPulse ? 'animate-pulse' : ''} ${className}`}>
        <IconComponent className={`w-3 h-3`} />
        <span>AI</span>
      </div>
    );
  }

  if (type === 'icon') {
    return (
      <div className={`relative inline-flex ${className}`}>
        <div className={`p-2 rounded-xl ${variantConfig.bg} ${variantConfig.text} shadow-lg ${showPulse ? 'animate-pulse-glow' : ''}`}>
          <IconComponent className={sizeConfig.icon} />
        </div>
        {showPulse && (
          <div className={`absolute inset-0 rounded-xl ${variantConfig.bg} opacity-30 animate-ping`}></div>
        )}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`inline-flex items-center gap-2 ${variantConfig.text} font-semibold ${sizeConfig.text} ${className}`}>
        <IconComponent className={sizeConfig.icon} />
        <span>{label}</span>
      </div>
    );
  }

  if (type === 'full') {
    return (
      <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl ${variantConfig.bg} ${variantConfig.text} font-semibold ${sizeConfig.full} shadow-lg hover:shadow-premium transition-all duration-300 cursor-pointer ${showPulse ? 'animate-pulse-glow' : ''} ${className}`}>
        <IconComponent className={sizeConfig.icon} />
        <span>{label}</span>
        {showPulse && (
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        )}
      </div>
    );
  }

  return null;
};

export const AIScore = ({ score, label, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold'
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`flex items-center gap-2`}>
        <span className={`${sizes[size]} ${getScoreColor(score)}`}>{score}%</span>
        <Sparkles className={`w-4 h-4 text-blue-500 animate-pulse`} />
      </div>
      {label && (
        <span className="text-xs text-slate-500 font-medium mt-1">{label}</span>
      )}
    </div>
  );
};

export const AIRecommendation = ({ title, description, priority = 'medium', onAction, className = '' }) => {
  const priorityStyles = {
    high: 'from-rose-50 to-orange-50 border-rose-200',
    medium: 'from-blue-50 to-violet-50 border-blue-200',
    low: 'from-emerald-50 to-green-50 border-emerald-200'
  };

  const priorityBadge = {
    high: 'bg-rose-100 text-rose-700',
    medium: 'bg-blue-100 text-blue-700',
    low: 'bg-emerald-100 text-emerald-700'
  };

  return (
    <div className={`p-4 rounded-xl border bg-gradient-to-r ${priorityStyles[priority]} ${className} hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg shadow-md animate-pulse-glow shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityBadge[priority]}`}>
              {priority}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">{description}</p>
          {onAction && (
            <button
              onClick={onAction}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              Take Action →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
