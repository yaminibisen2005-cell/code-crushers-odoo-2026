import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getMenuForRole } from '../config/menuConfig';
import { ROLE_DISPLAY_NAMES } from '../config/roles';
import {
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Settings as SettingsIcon,
  Truck,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/Button';
import { VtrackoraLogo, VtrackoraLogoIcon } from '../components/VtrackoraLogo';

export const DashboardLayout = ({ children }) => {
  const { user, logout, notifications, markAllNotificationsAsRead, clearNotifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Get menu items based on user role
  const menuItems = getMenuForRole(user?.role);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    const matched = menuItems.find(item => item.path === location.pathname);
    return matched ? matched.name : 'VTRACKORA';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-violet-50/20 flex text-slate-800 font-sans relative">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden lg:flex flex-col w-72 gradient-dark text-slate-300 shrink-0 border-r border-white/10 relative">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-transparent"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Brand / Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3 relative z-10">
          <VtrackoraLogoIcon size="lg" />
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-lg leading-none">VTRACKORA</span>
            <span className="text-[10px] text-blue-300 font-semibold tracking-wider uppercase mt-1">AI-Powered Logistics</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto relative z-10">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20 shadow-lg'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                  isActive ? 'text-blue-300 scale-110' : 'text-slate-400 group-hover:text-white group-hover:scale-110'
                }`} />
                <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Button */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col gap-3 relative z-10">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-blue-400/30 object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                <span className="text-[10px] text-blue-300 font-medium truncate">{ROLE_DISPLAY_NAMES[user.role] || user.role}</span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/30 hover:text-rose-200 transition-all duration-300 cursor-pointer text-left border border-transparent hover:border-rose-500/20 group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MOBILE MENU DRAWER ----------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-72 gradient-dark text-slate-300 h-full border-r border-white/10 z-50 animate-slide-in-left">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-transparent"></div>
            
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <VtrackoraLogoIcon size="lg" />
                <span className="font-bold text-white tracking-wide text-lg">VTRACKORA</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto relative z-10">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-white border border-white/20 shadow-lg'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                      isActive ? 'text-blue-300 scale-110' : 'text-slate-400 group-hover:text-white'
                    }`} />
                    <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col gap-3 relative z-10">
              {user && (
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-400/30"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                    <span className="text-[10px] text-blue-300 truncate">{ROLE_DISPLAY_NAMES[user.role] || user.role}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/30 hover:text-rose-200 transition-all duration-300 cursor-pointer text-left border border-transparent hover:border-rose-500/20"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVBAR */}
        <header className="h-20 glass-card border-b border-white/20 px-6 flex items-center justify-between sticky top-0 z-40 shadow-premium relative">
          
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">{getPageTitle()}</h1>
              <p className="hidden md:block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right: Search, Notifications, User Menu */}
          <div className="flex items-center gap-3">
            
            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all duration-300 cursor-pointer relative hover:shadow-md group"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Dropdown Box */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-80 glass-card border border-slate-200/80 rounded-2xl shadow-premium-lg py-2 z-50 transform origin-top-right transition-all animate-scale-in">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-violet-50/50 rounded-t-2xl">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      AI Activity Feed
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          markAllNotificationsAsRead();
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        Mark All Read
                      </button>
                      <span className="text-slate-300 text-xs">|</span>
                      <button
                        onClick={() => {
                          clearNotifications();
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                          <span>No new notifications</span>
                        </div>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-slate-50 transition-all duration-200 flex flex-col gap-1 cursor-pointer ${
                            !notif.read ? 'bg-gradient-to-r from-blue-50/50 to-violet-50/50 border-l-2 border-blue-400' : ''
                          }`}
                        >
                          <p className="text-xs text-slate-700 leading-normal font-medium">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${!notif.read ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            {notif.time}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Info Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition-all duration-300 hover:shadow-md group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-400/30 group-hover:ring-blue-400/50 transition-all"
                  />
                  <div className="hidden md:flex flex-col text-left min-w-0">
                    <span className="text-xs font-bold text-slate-800 leading-none truncate">{user.name}</span>
                    <span className="text-[10px] text-blue-600 font-medium mt-1 uppercase leading-none">{ROLE_DISPLAY_NAMES[user.role] || user.role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3.5 w-52 glass-card border border-slate-200/80 rounded-2xl shadow-premium-lg py-2 z-50 animate-scale-in">
                    <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-violet-50/50 rounded-t-2xl md:hidden">
                      <p className="text-xs font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-blue-600 font-medium">{ROLE_DISPLAY_NAMES[user.role] || user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer text-left group"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">Settings</span>
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-3 w-full px-4 py-3 text-xs text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer text-left group"
                    >
                      <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-500 group-hover:scale-110 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* CONTENT STAGE */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
