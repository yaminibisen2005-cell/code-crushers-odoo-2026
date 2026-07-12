import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  title = "No results found",
  description = "Try adjusting your search terms or filters, or add a new record.",
  actionLabel,
  onActionClick,
  icon: Icon = PackageOpen
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
      <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-4 animate-pulse">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onActionClick && (
        <Button onClick={onActionClick} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
