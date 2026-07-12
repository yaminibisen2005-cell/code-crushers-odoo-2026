import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { ROLES, ROLE_DISPLAY_NAMES } from '../config/roles';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { KeyRound, Mail, ShieldAlert, Truck, Sparkles, Navigation, Layers, User } from 'lucide-react';

export const Login = () => {
  const { login, showError, showSuccess } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@transitops.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      [ROLES.FLEET_MANAGER]: { email: 'admin@transitops.com', password: 'admin123' },
      [ROLES.DISPATCHER]: { email: 'dispatcher@transitops.com', password: 'dispatcher123' },
      [ROLES.SAFETY_OFFICER]: { email: 'safety@transitops.com', password: 'safety123' },
      [ROLES.FINANCIAL_ANALYST]: { email: 'finance@transitops.com', password: 'finance123' }
    };
    
    const creds = credentials[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      showSuccess(`Pre-filled ${ROLE_DISPLAY_NAMES[role]} credentials`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* LEFT PANEL: Illustration & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 text-slate-300 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Subtle glowing accents */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-blue-500/10">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-lg leading-none">TransitOps</span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">SaaS Fleet Engine</span>
          </div>
        </div>

        {/* Showcase Center Graphic & Title */}
        <div className="my-auto max-w-lg z-10 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold self-start">
            <Sparkles className="w-3.5 h-3.5" />
            Next Gen Fleet Management
          </div>
          
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Smart Transport Operations, Simplified.
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed">
            Consolidate and monitor live logistics, dispatch routes, drivers safety profiles, scheduled maintenance schedules, and fuel costs instantly in a high-contrast web dashboard.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 text-blue-400">
                <Navigation className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Advanced Route Dispatching</h4>
                <p className="text-xs text-slate-500 mt-0.5">Step-by-step route and weight scheduling with active driver licensing safety checks.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 text-blue-400">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Full Costs Analytics</h4>
                <p className="text-xs text-slate-500 mt-0.5">Automated fuel filling logs and scheduled workshop maintenance trackers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 z-10 flex items-center justify-between border-t border-slate-800 pt-6">
          <span>TransitOps Dashboard Platform v2.4</span>
          <span>© 2026 TransitOps Inc.</span>
        </div>
      </div>

      {/* RIGHT PANEL: Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to TransitOps</h3>
            <p className="text-sm text-slate-500">Sign in to manage your active transport fleet.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="login-email"
              label="Operational Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. manager@transitops.com"
              icon={Mail}
              required
            />

            <Input
              id="login-password"
              label="Security Access Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={KeyRound}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4"
                />
                Remember this device
              </label>
              
              <button
                type="button"
                onClick={() => showError('Password reset is managed by System Administration.')}
                className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 rounded-xl shadow-md text-sm font-bold"
              isLoading={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Demo Credentials Section */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Demo Authorization Credentials</span>
            </div>
            <p className="text-amber-700 leading-normal">
              This platform uses an interactive, stateful localStorage mock database. Select a role to authenticate:
            </p>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <button
                onClick={() => fillDemoCredentials(ROLES.FLEET_MANAGER)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-amber-900">{ROLE_DISPLAY_NAMES[ROLES.FLEET_MANAGER]}</span>
                  <span className="text-[10px] text-amber-600">admin@transitops.com / admin123</span>
                </div>
              </button>
              <button
                onClick={() => fillDemoCredentials(ROLES.DISPATCHER)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-amber-900">{ROLE_DISPLAY_NAMES[ROLES.DISPATCHER]}</span>
                  <span className="text-[10px] text-amber-600">dispatcher@transitops.com / dispatcher123</span>
                </div>
              </button>
              <button
                onClick={() => fillDemoCredentials(ROLES.SAFETY_OFFICER)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-amber-900">{ROLE_DISPLAY_NAMES[ROLES.SAFETY_OFFICER]}</span>
                  <span className="text-[10px] text-amber-600">safety@transitops.com / safety123</span>
                </div>
              </button>
              <button
                onClick={() => fillDemoCredentials(ROLES.FINANCIAL_ANALYST)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-amber-900">{ROLE_DISPLAY_NAMES[ROLES.FINANCIAL_ANALYST]}</span>
                  <span className="text-[10px] text-amber-600">finance@transitops.com / finance123</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
