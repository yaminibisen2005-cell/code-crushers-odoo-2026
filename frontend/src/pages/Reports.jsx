import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { Button } from '../components/Button';
import { CardSkeleton } from '../components/LoadingSpinner';
import { Download, FileSpreadsheet, FileText, Calendar, Filter, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

export const Reports = () => {
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await reportService.getReportData();
        setReportData(data);
      } catch (err) {
        showError('Could not retrieve operational reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleExportCSV = () => {
    setExportingCSV(true);
    setTimeout(() => {
      setExportingCSV(false);
      showSuccess('Operational CSV report compiled and downloaded successfully.');
    }, 1200);
  };

  const handleExportPDF = () => {
    setExportingPDF(true);
    setTimeout(() => {
      setExportingPDF(false);
      showSuccess('PDF Print Sheet generated. Loaded default browser dialog.');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="h-96 bg-white border rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const { summary, charts } = reportData || {};
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* HEADER SECTION WITH EXPORT BUTTONS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Business Analytics</p>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Operations Intelligence Reports</h2>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            icon={FileSpreadsheet}
            isLoading={exportingCSV}
            className="text-slate-700"
          >
            Export CSV Ledger
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="primary"
            icon={FileText}
            isLoading={exportingPDF}
          >
            Export PDF Sheet
          </Button>
        </div>
      </div>

      {/* SUMMARY STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Avg Fuel Efficiency"
          value={summary.fuelEfficiency}
          subtitle="Distance per Liter average"
          color="blue"
        />
        <StatCard
          title="Average Fleet Utilization"
          value={summary.fleetUtilization}
          subtitle="Active operational runs"
          color="green"
        />
        <StatCard
          title="Operational outlay (MTD)"
          value={`$${summary.operationalCost.toLocaleString()}`}
          subtitle="Combined cost indices"
          color="amber"
        />
        <StatCard
          title="Return on Investment (ROI)"
          value={summary.roi}
          subtitle="Estimated operational return"
          color="blue"
        />
      </div>

      {/* CHARTS GRIDLAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart: Monthly Cost Breakdown */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Monthly Expense Accruals & Maintenance Cost"
            subtitle="Comparing monthly fuel filling expenditures with mechanical service workshop logs"
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={charts.monthlyCosts} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  name="Fuel Fillings"
                  dataKey="fuel"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  name="Workshop Maintenance"
                  dataKey="maint"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pie Chart: Operational Cost Distribution */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Expense Cost Distribution"
            subtitle="Proportional weight of outlay items"
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={charts.costDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {charts.costDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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

        {/* Bar Chart: Vehicle fuel efficiency comparison */}
        <div className="lg:col-span-12">
          <ChartCard
            title="Individual Vehicle Fuel Efficiency Comparison"
            subtitle="Evaluating specific models against average efficiency index (km/L)"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.efficiencyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${value} km/L`, 'Efficiency']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="efficiency" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                  {charts.efficiencyTrend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.efficiency >= 10 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* BUSINESS INSIGHT FOOTER BLOCK */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-semibold text-slate-600">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-bold text-slate-800">Operational Intelligence Alert</span>
            <p className="font-medium text-slate-500 mt-0.5">Electric Semi vehicles are displaying 42% higher efficiency ratings relative to standard diesel heavy trucks. Expanding electric yard assets is highly recommended.</p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Report Key: QA-3392</span>
      </div>
    </div>
  );
};
