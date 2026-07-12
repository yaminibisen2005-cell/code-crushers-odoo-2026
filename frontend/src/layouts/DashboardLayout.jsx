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
  Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '../components/Button';

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
    return matched ? matched.name : 'VTrackora';
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex text-[#12263F] font-sans">
      
      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#071A2D] text-slate-300 shrink-0 border-r border-slate-800/80">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3 bg-[#071A2D]/50">
          <img src="/assets/logo/vtrackora-logo.png" alt="VTrackora" className="w-8 h-8 object-contain" />
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-base">VTrackora</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Track • Monitor • Deliver</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0F6FFF] via-[#27D7FF] to-[#A8F542] text-white shadow-lg hover:shadow-xl'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Button */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 flex flex-col gap-2">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-slate-700 object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                <span className="text-[10px] text-slate-500 font-medium truncate">{ROLE_DISPLAY_NAMES[user.role] || user.role}</span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MOBILE MENU DRAWER ----------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-64 bg-[#071A2D] text-slate-300 h-full border-r border-slate-800 z-50">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#071A2D]">
              <div className="flex items-center gap-3">
                <img src="/assets/logo/vtrackora-logo.png" alt="VTrackora" className="w-8 h-8 object-contain" />
                <span className="font-bold text-white tracking-wide text-base">VTrackora</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0F6FFF] via-[#27D7FF] to-[#A8F542] text-white shadow-lg'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/20 flex flex-col gap-2">
              {user && (
                <div className="flex items-center gap-3 px-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-slate-700"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                    <span className="text-xs text-slate-500 truncate">{ROLE_DISPLAY_NAMES[user.role] || user.role}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-[#E5EEF8] px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[#64748B] hover:text-[#12263F] p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#12263F] tracking-tight lg:text-lg">{getPageTitle()}</h1>
              <p className="hidden md:block text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right: Search, Notifications, User Menu */}
          <div className="flex items-center gap-4">
            
            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl border border-[#E5EEF8] hover:bg-slate-50 text-[#64748B] hover:text-[#12263F] transition-all duration-200 cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Dropdown Box */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-80 bg-white border border-[#E5EEF8] rounded-2xl shadow-xl py-2 z-50 transform origin-top-right transition-all animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-[#E5EEF8] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#12263F]">System Activity</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          markAllNotificationsAsRead();
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-[#0F6FFF] hover:text-[#0A4DB8] cursor-pointer"
                      >
                        Read All
                      </button>
                      <span className="text-slate-300 text-xs">|</span>
                      <button
                        onClick={() => {
                          clearNotifications();
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-[#64748B]">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-slate-50 transition-colors flex flex-col gap-1 ${
                            !notif.read ? 'bg-blue-50/35' : ''
                          }`}
                        >
                          <p className="text-xs text-[#12263F] leading-normal">{notif.message}</p>
                          <span className="text-[9px] text-[#64748B] font-medium">{notif.time}</span>
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
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl border border-[#E5EEF8] hover:bg-slate-50 cursor-pointer transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-50"
                  />
                  <div className="hidden md:flex flex-col text-left min-w-0">
                    <span className="text-xs font-bold text-[#12263F] leading-none truncate">{user.name}</span>
                    <span className="text-[9px] text-[#64748B] font-medium mt-1 uppercase leading-none">{ROLE_DISPLAY_NAMES[user.role] || user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3.5 w-48 bg-white border border-[#E5EEF8] rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E5EEF8] md:hidden">
                      <p className="text-xs font-bold text-[#12263F]">{user.name}</p>
                      <p className="text-[10px] text-[#64748B]">{ROLE_DISPLAY_NAMES[user.role] || user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-[#12263F] hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <SettingsIcon className="w-4 h-4 text-[#64748B]" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
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
