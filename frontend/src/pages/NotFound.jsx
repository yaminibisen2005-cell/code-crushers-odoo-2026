import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <div className="p-4 bg-red-50 text-red-600 rounded-full mb-5 border border-red-100 animate-bounce">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">404 - Page Not Found</h2>
      <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
        The logistical route or operational dashboard panel you are trying to view does not exist in the VTrackora directory.
      </p>
      <Button onClick={() => navigate('/')} variant="primary" icon={Home}>
        Return to Dashboard
      </Button>
    </div>
  );
};
