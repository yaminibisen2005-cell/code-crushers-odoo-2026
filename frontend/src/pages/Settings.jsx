import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { StatusBadge } from '../components/StatusBadge';
import { User, Bell, Shield, Lock, Laptop, Check, X, Sparkles } from 'lucide-react';

export const Settings = () => {
  const { user, showSuccess } = useApp();

  // Settings states
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Harrison',
    email: user?.email || 'admin@transitops.com',
    phone: '+1-555-0192',
    role: user?.role || 'Operations Manager'
  });

  const [notifications, setNotifications] = useState({
    dispatchAlerts: true,
    maintReminders: true,
    fuelReports: false,
    soundEffects: true
  });

  const [systemTheme, setSystemTheme] = useState('Light Mode');

  const handleProfileSave = (e) => {
    e.preventDefault();
    showSuccess('Profile configuration saved successfully.');
  };

  const handleToggle = (key) => {
    const nextVal = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: nextVal }));
    showSuccess(`Preference updated: ${key.replace(/([A-Z])/g, ' $1')} is now ${nextVal ? 'ENABLED' : 'DISABLED'}`);
  };

  // Role Permissions Data Matrix
  const permissionsMatrix = [
    { permission: 'Register Fleet Assets & Drivers', admin: true, manager: true, dispatcher: false, operator: false },
    { permission: 'Dispatch Logistical Cargo Routes', admin: true, manager: true, dispatcher: true, operator: false },
    { permission: 'Schedule Repairs & Maintenance Workshop', admin: true, manager: true, dispatcher: true, operator: true },
    { permission: 'Clear Financial Ledgers & Logs', admin: true, manager: false, dispatcher: false, operator: false },
    { permission: 'Compile & Export Financial PDF Reports', admin: true, manager: true, dispatcher: true, operator: false }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in font-medium">
      
      {/* LEFT COLUMN: PROFILE & PREFERENCES */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-800">Operational Profile</h3>
              <span className="text-xs text-slate-400">Manage your credentials and credentials</span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <img
                src={user?.avatar}
                alt="Profile Avatar"
                className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-500/10"
              />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-bold uppercase">System Authority</span>
                <span className="text-sm font-black text-slate-800 tracking-tight mt-0.5">{profile.role}</span>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5 uppercase tracking-wider">Level 4 Clearance</span>
              </div>
            </div>

            <Input
              id="profile-name"
              label="Legal Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />

            <Input
              id="profile-email"
              label="Operational Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
              disabled
              helperText="Managed by System Directory Security."
            />

            <Input
              id="profile-phone"
              label="Contact Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
            />

            <Button type="submit" variant="primary" className="w-full py-2.5 rounded-xl font-bold mt-2">
              Save Profile Detail
            </Button>
          </form>
        </div>

        {/* System Settings & Toggles */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-800">Alerts & System Preferences</h3>
              <span className="text-xs text-slate-400">Configure workspace parameters</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs font-semibold text-slate-700">
            {/* Toggles */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-col gap-0.5 max-w-[210px]">
                <span>Dispatch Status Alerts</span>
                <span className="text-[10px] text-slate-400 font-medium">Receive browser notifications when a trip completes</span>
              </div>
              <button
                onClick={() => handleToggle('dispatchAlerts')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  notifications.dispatchAlerts ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  notifications.dispatchAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-col gap-0.5 max-w-[210px]">
                <span>Maintenance Shop Reminders</span>
                <span className="text-[10px] text-slate-400 font-medium">Alert when mechanical logs are delayed / past scheduled date</span>
              </div>
              <button
                onClick={() => handleToggle('maintReminders')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  notifications.maintReminders ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  notifications.maintReminders ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-col gap-0.5 max-w-[210px]">
                <span>Fuel filling CSV Digest</span>
                <span className="text-[10px] text-slate-400 font-medium">Compile monthly expense csv and send to accounts automatically</span>
              </div>
              <button
                onClick={() => handleToggle('fuelReports')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  notifications.fuelReports ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  notifications.fuelReports ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Select theme */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5 max-w-[210px]">
                <span>Workspace Interface Theme</span>
                <span className="text-[10px] text-slate-400 font-medium">Choose system rendering style</span>
              </div>
              <select
                value={systemTheme}
                onChange={(e) => {
                  setSystemTheme(e.target.value);
                  showSuccess(`Theme changed to ${e.target.value}. Default fallback applied.`);
                }}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 cursor-pointer focus:outline-none"
              >
                <option value="Light Mode">Light Theme (Default)</option>
                <option value="Brutalist Slate">Brutalist Slate</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: PERMISSIONS MATRIX */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-800">Role Permissions Security Matrix</h3>
              <span className="text-xs text-slate-400 mt-1">Cross-reference active operator authorization keys</span>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs text-slate-600 font-semibold border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Action Parameters</th>
                  <th className="px-4 py-4 text-center">Administrator</th>
                  <th className="px-4 py-4 text-center">Ops Manager</th>
                  <th className="px-4 py-4 text-center">Dispatcher</th>
                  <th className="px-4 py-4 text-center">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-slate-800 leading-normal max-w-xs">{item.permission}</td>
                    <td className="px-4 py-4.5 text-center">
                      {item.admin ? (
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-4.5 text-center bg-blue-50/20">
                      {item.manager ? (
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-4.5 text-center">
                      {item.dispatcher ? (
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto text-opacity-40" />
                      )}
                    </td>
                    <td className="px-4 py-4.5 text-center">
                      {item.operator ? (
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto text-opacity-40" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
            <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Operational Restrictions:</strong> The Active profile 'Alex Harrison' possesses 'Operations Manager' status clearances. Operations Manager is locked out of clearing primary cost ledger entries in accordance with company audit constraints.
            </span>
          </div>
        </div>

        {/* Brand visual card */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg flex flex-col gap-2 border border-slate-950">
          <Sparkles className="absolute -bottom-4 -right-4 w-28 h-28 text-slate-800/80 pointer-events-none" />
          <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest">Workspace Verification Key</span>
          <h4 className="text-base font-black tracking-tight mt-1">Audit Log Compliance Level A</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            All vehicle registrations, dispatch parameters, driver Safety Score modifications, and mechanic costs are logged with cryptographic hashes on transport operational nodes.
          </p>
        </div>
      </div>
    </div>
  );
};
