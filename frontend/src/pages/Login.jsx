import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { ROLES, ROLE_DISPLAY_NAMES } from '../config/roles';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { KeyRound, Mail, ChevronDown, MapPin, Truck, Package, Route, Fuel, Check, Sparkles, Map, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { login, showError, showSuccess } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@vtrackora.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(email.trim(), password);

      login(data);

      showSuccess("Login successful");

      navigate("/");
    } catch (error) {
      showError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    fillDemoCredentials(role);
  };
  const fillDemoCredentials = (role) => {
    const credentials = {
      [ROLES.FLEET_MANAGER]: { email: 'admin@vtrackora.com', password: 'password123' },
      [ROLES.DISPATCHER]: { email: 'dispatcher@vtrackora.com', password: 'password123' },
      [ROLES.SAFETY_OFFICER]: { email: 'safety@vtrackora.com', password: 'password123' },
      [ROLES.FINANCIAL_ANALYST]: { email: 'finance@vtrackora.com', password: 'password123' }
    };
    
    const creds = credentials[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* LEFT PANEL: Hero Section with Background Image */}
      <div className="md:w-1/2 relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800 min-h-[300px] md:min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/assets/login background/background screen.png")' }}
        />
        
        {/* Dark Navy Overlay */}
        <div className="absolute inset-0 bg-[#081B33]/70" />
        
        {/* Blue → Aqua Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F6FFF]/20 via-transparent to-[#27D7FF]/20" />
        
        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Glowing Particles */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-32 h-32 bg-[#0F6FFF]/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[30%] right-[20%] w-40 h-40 bg-[#27D7FF]/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col p-8 md:p-12">
          {/* Brand Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <img src="/assets/logo/vtrackora-logo.png" alt="VTrackora" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-wide text-sm md:text-lg leading-none">VTrackora</span>
              <span className="text-[10px] md:text-xs text-white/60 font-semibold uppercase tracking-widest mt-0.5 md:mt-1">Track • Monitor • Deliver</span>
            </div>
          </motion.div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            {/* Glowing Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] md:text-xs font-semibold self-start mb-8"
            >
              <Truck className="w-3 h-3 md:w-4 md:h-4 text-[#27D7FF]" />
              <span className="text-white"> Next Gen Fleet Platform</span>
            </motion.div>
            
            {/* Heading */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6"
            >
              Smart{' '}
              <span className="bg-gradient-to-r from-[#0F6FFF] via-[#27D7FF] to-[#A8F542] bg-clip-text text-transparent">
                Fleet
              </span>
              <br />
              Management
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-white/70 leading-relaxed max-w-md"
            >
              Manage vehicles, drivers and trips from one intelligent platform.
            </motion.p>
          </div>

          {/* Floating Dashboard Preview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="self-end p-5 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl max-w-[280px] md:max-w-xs"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Fleet Online</span>
                <span className="text-sm font-bold text-white">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Active Vehicles</span>
                <span className="text-sm font-bold text-white">250+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Live Trips</span>
                <span className="text-sm font-bold text-white">32</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-xs text-white/60">Status</span>
                <span className="text-xs font-bold text-[#22C55E]">Operational</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 relative bg-[#F7FAFC]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-[#E5EEF8] rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 flex flex-col gap-4 md:gap-6"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Welcome to VTrackora</h3>
            <p className="text-xs md:text-sm text-slate-500">Sign in to manage your active transport fleet.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
            {/* Role Selection Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#12263F] uppercase tracking-wider">Login As</label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E5EEF8] rounded-xl text-sm text-[#12263F] font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F6FFF]/20 focus:border-[#0F6FFF] transition-all"
                >
                  <option value="">Select a role...</option>
                  <option value={ROLES.FLEET_MANAGER}>{ROLE_DISPLAY_NAMES[ROLES.FLEET_MANAGER]}</option>
                  <option value={ROLES.DISPATCHER}>{ROLE_DISPLAY_NAMES[ROLES.DISPATCHER]}</option>
                  <option value={ROLES.SAFETY_OFFICER}>{ROLE_DISPLAY_NAMES[ROLES.SAFETY_OFFICER]}</option>
                  <option value={ROLES.FINANCIAL_ANALYST}>{ROLE_DISPLAY_NAMES[ROLES.FINANCIAL_ANALYST]}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
              </div>
              <p className="text-[10px] text-[#64748B]">Select a role to auto-fill demo credentials.</p>
            </div>
            <Input
              id="login-email"
              label="Operational Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. manager@vtrackora.com"
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
              <label className="flex items-center gap-2 font-medium text-[#64748B] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#0F6FFF] focus:ring-[#0F6FFF]/20 border-[#E5EEF8] w-4 h-4"
                />
                Remember this device
              </label>

              <button
                type="button"
                onClick={() => showError('Password reset is managed by System Administration.')}
                className="font-semibold text-[#0F6FFF] hover:text-[#0A4DB8] cursor-pointer hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 md:py-3 rounded-xl shadow-lg text-xs md:text-sm font-bold"
              isLoading={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs md:text-sm">
            <span className="text-[#64748B]">Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-semibold text-[#0F6FFF] hover:text-[#0A4DB8] cursor-pointer hover:underline"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
