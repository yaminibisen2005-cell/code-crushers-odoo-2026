import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dashboardService } from '../../services/dashboardService';
import { StatCard } from '../../components/StatCard';
import { ChartCard } from '../../components/ChartCard';
import { StatusBadge } from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSpinner';
import { AIIndicator, AIScore, AIRecommendation } from '../../components/AIIndicator';
import {
  Truck,
  Wrench,
  Percent,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const FleetManagerDashboard = () => {
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getSummary();
        setDashboardData(data);
      } catch (err) {
        showError('Could not retrieve dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-80 bg-white border rounded-2xl animate-pulse"></div>
          <div className="h-80 bg-white border rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const { kpis, utilizationTrend, operationalCosts, fuelEfficiency } = dashboardData || {};
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* AI Insights Banner */}
      <div className="glass-card border border-blue-200/50 rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-violet-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-violet-400/20 rounded-full blur-2xl"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl shadow-lg animate-pulse-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              AI Fleet Insights
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Live</span>
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Fleet efficiency increased by 12% this week. AI recommends optimizing route TX-9021 to reduce fuel consumption by 8%.
            </p>
          </div>
          <button className="px-4 py-2 bg-white border border-blue-200 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:shadow-md">
            View Details
          </button>
        </div>
      </div>

      {/* Fleet KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Fleet"
          value={kpis?.activeVehicles + kpis?.availableVehicles + kpis?.vehiclesInShop || 0}
          subtitle="All vehicles"
          color="blue"
          icon={Truck}
        />
        <StatCard
          title="Active Vehicles"
          value={kpis?.activeVehicles || 0}
          subtitle="Currently on routes"
          color="green"
          icon={CheckCircle2}
          trend={{ type: 'up', text: '+2' }}
        />
        <StatCard
          title="Vehicles In Shop"
          value={kpis?.vehiclesInShop || 0}
          subtitle="Maintenance required"
          color="amber"
          icon={Wrench}
        />
        <StatCard
          title="Fleet Utilization"
          value={`${kpis?.fleetUtilization || 0}%`}
          subtitle="Capacity efficiency"
          color="violet"
          icon={Percent}
          trend={{ type: 'up', text: '5%' }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Weekly Fleet Utilization"
          subtitle="Live capacity allocation relative to available fleet"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={utilizationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUtilization" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              />
              <Area
                type="monotone"
                dataKey="utilization"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUtilization)"
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Operational Expense Distribution"
          subtitle="Proportional breakdown of major logistics costs"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={operationalCosts}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={4}
                dataKey="amount"
              >
                {operationalCosts?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card border border-violet-200/50 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Route Score</span>
            </div>
            <AIIndicator type="badge" size="sm" variant="primary" />
          </div>
          <AIScore score={94} label="Optimization efficiency" size="lg" />
        </div>
        
        <div className="glass-card border border-emerald-200/50 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fuel Efficiency</span>
            </div>
            <AIIndicator type="badge" size="sm" variant="accent" />
          </div>
          <AIScore score={82} label="Average fleet performance" size="lg" />
        </div>
        
        <div className="glass-card border border-blue-200/50 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Driver Safety</span>
            </div>
            <AIIndicator type="badge" size="sm" variant="primary" />
          </div>
          <AIScore score={96} label="Safety compliance rating" size="lg" />
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          AI Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AIRecommendation
            title="Optimize Route TX-9021"
            description="AI analysis suggests rerouting through I-35 could reduce fuel consumption by 8% and save 45 minutes."
            priority="high"
            onAction={() => {}}
          />
          <AIRecommendation
            title="Schedule Maintenance for TX-1188"
            description="Predictive maintenance indicates brake replacement needed within 500 miles to prevent safety issues."
            priority="medium"
            onAction={() => {}}
          />
        </div>
      </div>

      {/* Maintenance Summary */}
      <div className="glass-card border border-slate-200/80 rounded-2xl p-6 shadow-premium">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-500" />
              Predictive Maintenance
            </h3>
            <p className="text-xs text-slate-500 mt-1">AI-powered maintenance scheduling</p>
          </div>
          <StatusBadge status="Scheduled" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-lg group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Brake Replacement - TX-1188</p>
                <p className="text-xs text-slate-500 mt-0.5">Due in 2 days • AI Priority: High</p>
              </div>
            </div>
            <StatusBadge status="Pending" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl border border-blue-200/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Oil Change - TX-9021</p>
                <p className="text-xs text-slate-500 mt-0.5">Due in 5 days • AI Priority: Medium</p>
              </div>
            </div>
            <StatusBadge status="Scheduled" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Tire Rotation - TX-3344</p>
                <p className="text-xs text-slate-500 mt-0.5">Due in 7 days • AI Priority: Low</p>
              </div>
            </div>
            <StatusBadge status="Scheduled" />
          </div>
        </div>
      </div>
    </div>
  );
};
