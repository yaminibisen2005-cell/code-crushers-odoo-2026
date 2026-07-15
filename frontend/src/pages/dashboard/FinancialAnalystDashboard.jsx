import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dashboardService } from '../../services/dashboardService';
import { fuelService } from '../../services/fuelService';
import { StatCard } from '../../components/StatCard';
import { ChartCard } from '../../components/ChartCard';
import { CardSkeleton } from '../../components/LoadingSpinner';
import {
  DollarSign,
  TrendingUp,
  Fuel,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
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

export const FinancialAnalystDashboard = () => {
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [fuelData, setFuelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashData, fuelRecords] = await Promise.all([
          dashboardService.getSummary(),
          fuelService.getAllFuelRecords()
        ]);
        setDashboardData(dashData);
        setFuelData(fuelRecords);
      } catch (err) {
        showError('Could not retrieve dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  const { operationalCosts, fuelEfficiency } = dashboardData || {};
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  // Calculate total fuel costs
  const totalFuelCost = fuelData.reduce((sum, record) => sum + (record.cost || 0), 0);
  const totalFuelGallons = fuelData.reduce((sum, record) => sum + (record.gallons || 0), 0);
  const avgCostPerGallon = totalFuelGallons > 0 ? (totalFuelCost / totalFuelGallons).toFixed(2) : 0;

  // Monthly fuel cost data
  const monthlyFuelCost = fuelData.reduce((acc, record) => {
    const month = new Date(record.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + (record.cost || 0);
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyFuelCost).map(([month, cost]) => ({
    name: month,
    cost: cost
  }));

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fuel Cost"
          value={`$${totalFuelCost.toLocaleString()}`}
          subtitle="This month"
          color="blue"
          icon={Fuel}
          trend={{ type: 'up', text: '+8%' }}
        />
        <StatCard
          title="Operational Costs"
          value={`$${operationalCosts?.reduce((sum, item) => sum + item.amount, 0)?.toLocaleString() || 0}`}
          subtitle="Total expenses"
          color="amber"
          icon={DollarSign}
        />
        <StatCard
          title="Avg Cost/Gallon"
          value={`$${avgCostPerGallon}`}
          subtitle="Fuel efficiency"
          color="green"
          icon={TrendingUp}
          trend={{ type: 'down', text: '-2%' }}
        />
        <StatCard
          title="ROI"
          value="18.5%"
          subtitle="Return on investment"
          color="purple"
          icon={BarChart3}
          trend={{ type: 'up', text: '+3%' }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Fuel Costs"
          subtitle="Fuel expenditure trends over time"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Cost']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Operational Expense Distribution"
          subtitle="Breakdown of operational costs"
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

      {/* Fuel Efficiency Trends */}
      <ChartCard
        title="Fuel Efficiency Trends (km/L)"
        subtitle="Monthly fleet average distance covered per unit fuel"
      >
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={fuelEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              formatter={(value) => [`${value} km/L`, 'Efficiency']}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
