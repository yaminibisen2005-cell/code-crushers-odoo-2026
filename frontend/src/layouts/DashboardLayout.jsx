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
    return matched ? matched.name : 'TransitOps';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      
      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800/80">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3 bg-slate-900/50">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-base">TransitOps</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">SaaS Fleet Engine</span>
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
                    ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500 shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
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
          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-300 h-full border-r border-slate-800 z-50">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  T
                </div>
                <span className="font-bold text-white tracking-wide text-base">TransitOps</span>
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
                        ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
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
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-slate-800 tracking-tight lg:text-lg">{getPageTitle()}</h1>
              <p className="hidden md:block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
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
                className="p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all duration-200 cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Dropdown Box */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 transform origin-top-right transition-all animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">System Activity</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          markAllNotificationsAsRead();
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
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
                      <div className="px-4 py-6 text-center text-xs text-slate-400">
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
                          <p className="text-xs text-slate-700 leading-normal">{notif.message}</p>
                          <span className="text-[9px] text-slate-400 font-medium">{notif.time}</span>
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
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-50"
                  />
                  <div className="hidden md:flex flex-col text-left min-w-0">
                    <span className="text-xs font-bold text-slate-800 leading-none truncate">{user.name}</span>
                    <span className="text-[9px] text-slate-500 font-medium mt-1 uppercase leading-none">{ROLE_DISPLAY_NAMES[user.role] || user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                      <p className="text-xs font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-500">{ROLE_DISPLAY_NAMES[user.role] || user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-400" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
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
