import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { ROLES, ROLE_DISPLAY_NAMES } from '../config/roles';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { KeyRound, Mail, Phone, User, ChevronDown, Sparkles, MapPin, Truck, Package, Route, Fuel, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = () => {
  const { showError, showSuccess } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await authService.register(formData);
      showSuccess('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* LEFT PANEL: Illustration & Branding */}
      <div className="md:w-1/2 bg-[#081B33] text-slate-300 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800 min-h-[300px] md:min-h-auto">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F6FFF]/10 via-transparent to-[#27D7FF]/10 pointer-events-none"></div>
        {/* Subtle glowing accents */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0F6FFF]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#27D7FF]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <img src="/assets/logo/vtrackora-logo.png" alt="VTrackora" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-lg leading-none">VTrackora</span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">Track • Monitor • Deliver</span>
          </div>
        </div>

        {/* Showcase Center Graphic & Title */}
        <div className="my-auto max-w-lg z-10 flex flex-col gap-4 md:gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F6FFF]/10 text-[#27D7FF] border border-[#0F6FFF]/20 text-[10px] md:text-xs font-semibold self-start">
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Join the Fleet Revolution
          </div>
          
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Smart Fleet Management,<br />Powered by Intelligence.
          </h2>
          
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Create your account to start managing vehicles, drivers, dispatch trips, tracking fuel usage, and optimizing fleet operations.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-1 gap-2 md:gap-3 mt-2 md:mt-4">
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-300">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-[#22C55E]" />
              <span>Live Vehicle Tracking</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-300">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-[#22C55E]" />
              <span>Driver Safety Monitoring</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-300">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-[#22C55E]" />
              <span>Smart Route Dispatch</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-300">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-[#22C55E]" />
              <span>Maintenance Scheduling</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-300">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-[#22C55E]" />
              <span>Fuel & Expense Analytics</span>
            </div>
          </div>

          {/* Floating Glass Cards */}
          <div className="relative mt-4 md:mt-8 h-24 md:h-32 hidden md:block">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#27D7FF]" />
              <span className="text-xs font-semibold text-white">Live Tracking</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-0 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-[#0F6FFF]" />
              <span className="text-xs font-semibold text-white">Fleet Status</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-16 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#A8F542]" />
              <span className="text-xs font-semibold text-white">Deliveries</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 right-12 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-2"
            >
              <Route className="w-4 h-4 text-[#1ED5C3]" />
              <span className="text-xs font-semibold text-white">Route Optimization</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 right-24 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-2"
            >
              <Fuel className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-semibold text-white">Fuel Analytics</span>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] md:text-xs text-slate-500 z-10 flex items-center justify-between border-t border-slate-800 pt-4 md:pt-6">
          <span>VTrackora Dashboard Platform v2.4</span>
          <span>© 2026 VTrackora Inc.</span>
        </div>
      </div>

      {/* RIGHT PANEL: Register Card */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 relative bg-[#F7FAFC]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-[#E5EEF8] rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 flex flex-col gap-4 md:gap-6"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Create Account</h3>
            <p className="text-xs md:text-sm text-slate-500">Join VTrackora to manage your fleet operations.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
            <Input
              id="register-fullname"
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              icon={User}
              error={errors.fullName}
              required
            />

            <Input
              id="register-email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@company.com"
              icon={Mail}
              error={errors.email}
              required
            />

            <Input
              id="register-phone"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1-555-0100"
              icon={Phone}
              error={errors.phone}
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#12263F] uppercase tracking-wider">Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#12263F] font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F6FFF]/20 focus:border-[#0F6FFF] transition-all ${errors.role ? 'border-red-500' : 'border-[#E5EEF8]'}`}
                >
                  <option value="">Select a role...</option>
                  <option value={ROLES.FLEET_MANAGER}>{ROLE_DISPLAY_NAMES[ROLES.FLEET_MANAGER]}</option>
                  <option value={ROLES.DISPATCHER}>{ROLE_DISPLAY_NAMES[ROLES.DISPATCHER]}</option>
                  <option value={ROLES.SAFETY_OFFICER}>{ROLE_DISPLAY_NAMES[ROLES.SAFETY_OFFICER]}</option>
                  <option value={ROLES.FINANCIAL_ANALYST}>{ROLE_DISPLAY_NAMES[ROLES.FINANCIAL_ANALYST]}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
              </div>
              {errors.role && <p className="text-[10px] text-red-500">{errors.role}</p>}
            </div>

            <Input
              id="register-password"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={KeyRound}
              error={errors.password}
              required
            />

            <Input
              id="register-confirm-password"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={KeyRound}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 md:py-3 rounded-xl shadow-lg text-xs md:text-sm font-bold"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs md:text-sm">
            <span className="text-[#64748B]">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-[#0F6FFF] hover:text-[#0A4DB8] cursor-pointer hover:underline"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
