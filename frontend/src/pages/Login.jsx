import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { ROLES, ROLE_DISPLAY_NAMES } from '../config/roles';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { VtrackoraLogo } from '../components/VtrackoraLogo';
import { KeyRound, Mail, ShieldAlert, Sparkles, Navigation, Layers, User, Truck } from 'lucide-react';

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
      [ROLES.FLEET_MANAGER]: { email: 'admin@vtrackora.com', password: 'admin123' },
      [ROLES.DISPATCHER]: { email: 'dispatcher@vtrackora.com', password: 'dispatcher123' },
      [ROLES.SAFETY_OFFICER]: { email: 'safety@vtrackora.com', password: 'safety123' },
      [ROLES.FINANCIAL_ANALYST]: { email: 'finance@vtrackora.com', password: 'finance123' }
    };
    
    const creds = credentials[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      showSuccess(`Pre-filled ${ROLE_DISPLAY_NAMES[role]} credentials`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 flex flex-col md:flex-row overflow-hidden font-sans relative">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* LEFT PANEL: Illustration & Branding */}
      <div className="hidden md:flex md:w-1/2 gradient-dark text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-transparent"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Glowing orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10 animate-slide-in-left">
          <VtrackoraLogo size="lg" showTagline={false} />
        </div>

        {/* Showcase Center Graphic & Title */}
        <div className="my-auto max-w-lg z-10 flex flex-col gap-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold self-start animate-float">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span className="text-gradient-primary">Next-Gen Fleet Intelligence</span>
          </div>
          
          <h2 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
            Smart Transport
            <span className="text-gradient-primary"> Operations</span>
          </h2>
          
          <p className="text-slate-300 text-base leading-relaxed">
            Revolutionize your logistics with AI-powered fleet management, real-time vehicle tracking, intelligent dispatch operations, and predictive analytics—all in one stunning platform.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-1 gap-5 mt-4">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-blue-300 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white group-hover:text-blue-200 transition-colors">AI Route Optimization</h4>
                <p className="text-sm text-slate-400 mt-1">Machine learning algorithms for optimal route planning and fuel efficiency.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-violet-300 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white group-hover:text-violet-200 transition-colors">Predictive Maintenance</h4>
                <p className="text-sm text-slate-400 mt-1">AI-powered diagnostics to predict and prevent vehicle breakdowns.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-emerald-300 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white group-hover:text-emerald-200 transition-colors">Real-Time Fleet Tracking</h4>
                <p className="text-sm text-slate-400 mt-1">Live GPS tracking with intelligent alerts and driver safety monitoring.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 z-10 flex items-center justify-between border-t border-white/10 pt-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
          <span className="font-medium">VTRACKORA Platform v3.0</span>
          <span className="text-slate-500">© 2026 VTRACKORA Inc.</span>
        </div>
      </div>

      {/* RIGHT PANEL: Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md glass-card rounded-3xl shadow-premium-lg p-8 md:p-10 flex flex-col gap-6 animate-scale-in relative overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full blur-2xl"></div>
          
          <div className="flex flex-col gap-3 relative z-10">
            <VtrackoraLogo size="md" showTagline={false} />
            <p className="text-sm text-slate-500">Sign in to access your AI-powered fleet dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              icon={Mail}
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={KeyRound}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer select-none hover:text-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 border-slate-300 w-4 h-4"
                />
                Remember me
              </label>
              
              <button
                type="button"
                onClick={() => showError('Password reset is managed by IT Administration.')}
                className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 rounded-xl shadow-lg text-sm font-bold gradient-primary hover:shadow-premium-lg transition-all duration-300 hover:scale-[1.02]"
              isLoading={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Demo Credentials Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 flex flex-col gap-4 text-xs relative z-10">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </div>
              <span>Demo Access Credentials</span>
            </div>
            <p className="text-amber-700 leading-normal">
              Experience the platform with our interactive demo environment. Select a role to authenticate:
            </p>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <button
                onClick={() => fillDemoCredentials(ROLES.FLEET_MANAGER)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 cursor-pointer text-left hover:shadow-md group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{ROLE_DISPLAY_NAMES[ROLES.FLEET_MANAGER]}</span>
                  <span className="text-[10px] text-slate-500">admin@vtrackora.com / admin123</span>
                </div>
              </button>
              <button
                onClick={() => fillDemoCredentials(ROLES.DISPATCHER)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 cursor-pointer text-left hover:shadow-md group"
              >
                <div className="p-2 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition-colors">
                  <User className="w-4 h-4 text-violet-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{ROLE_DISPLAY_NAMES[ROLES.DISPATCHER]}</span>
                  <span className="text-[10px] text-slate-500">dispatcher@vtrackora.com / dispatcher123</span>
                </div>
              </button>
              <button
                onClick={() => fillDemoCredentials(ROLES.SAFETY_OFFICER)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 cursor-pointer text-left hover:shadow-md group"
              >
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{ROLE_DISPLAY_NAMES[ROLES.SAFETY_OFFICER]}</span>
                  <span className="text-[10px] text-slate-500">safety@vtrackora.com / safety123</span>
                </div>
              </button>
              <button
                onClick={() => fillDemoCredentials(ROLES.FINANCIAL_ANALYST)}
                className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 cursor-pointer text-left hover:shadow-md group"
              >
                <div className="p-2 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                  <User className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{ROLE_DISPLAY_NAMES[ROLES.FINANCIAL_ANALYST]}</span>
                  <span className="text-[10px] text-slate-500">finance@vtrackora.com / finance123</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
