import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dashboardService } from '../../services/dashboardService';
import { StatCard } from '../../components/StatCard';
import { ChartCard } from '../../components/ChartCard';
import { StatusBadge } from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSpinner';
import {
  Truck,
  Wrench,
  Percent,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
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
  Legend
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
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
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
          color="blue"
          icon={Percent}
          trend={{ type: 'up', text: '5%' }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Weekly Fleet Utilization %"
          subtitle="Live capacity allocation relative to available fleet"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={utilizationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Operational Expense Distribution"
          subtitle="Proportional breakdown of major logistics costs"
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={operationalCosts}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="amount"
              >
                {operationalCosts?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Maintenance Summary */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Maintenance Summary</h3>
            <p className="text-xs text-slate-400 mt-1">Upcoming scheduled maintenance</p>
          </div>
          <StatusBadge status="Scheduled" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Brake Replacement - TX-1188</p>
                <p className="text-xs text-slate-500">Due in 2 days</p>
              </div>
            </div>
            <StatusBadge status="Pending" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Oil Change - TX-9021</p>
                <p className="text-xs text-slate-500">Due in 5 days</p>
              </div>
            </div>
            <StatusBadge status="Scheduled" />
          </div>
        </div>
      </div>
    </div>
  );
};
