import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { authService } from "../services/authService";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { KeyRound, Mail, Sparkles, Navigation, Layers } from "lucide-react";

export const Login = () => {
  const { login, showError, showSuccess } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@vtrackora.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('');


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* LEFT PANEL */}

      <div className="hidden md:flex md:w-1/2 bg-slate-900 text-slate-300 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* BRAND */}

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-blue-500/10">
            T
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-lg leading-none">
              TransitOps
            </span>

            <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">
              SaaS Fleet Engine
            </span>
          </div>
        </div>

        {/* CONTENT */}

        <div className="my-auto max-w-lg z-10 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold self-start">
            <Sparkles className="w-3.5 h-3.5" />
            Next Gen Fleet Management
          </div>

          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Smart Transport Operations, Simplified.
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            Consolidate and monitor logistics, dispatch routes, driver safety
            profiles, maintenance schedules and operational costs through one
            powerful fleet dashboard.
          </p>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 text-blue-400">
                <Navigation className="w-4.5 h-4.5" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  Advanced Route Dispatching
                </h4>

                <p className="text-xs text-slate-500 mt-0.5">
                  Manage routes, vehicles and driver assignments with
                  operational validation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 text-blue-400">
                <Layers className="w-4.5 h-4.5" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  Fleet Cost Analytics
                </h4>

                <p className="text-xs text-slate-500 mt-0.5">
                  Track fuel, maintenance and fleet operational expenses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="text-xs text-slate-500 z-10 flex items-center justify-between border-t border-slate-800 pt-6">
          <span>TransitOps Dashboard Platform</span>
          <span>© 2026 TransitOps</span>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome to TransitOps
            </h3>

            <p className="text-sm text-slate-500">
              Sign in to manage your transport fleet.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="login-email"
              label="Operational Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@transitops.com"
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
                onClick={() =>
                  showError(
                    "Password reset is managed by System Administration.",
                  )
                }
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

          <div className="text-center border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-500">
              Secure access powered by TransitOps Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
