import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { maintenanceService } from '../services/maintenanceService';
import { vehicleService } from '../services/vehicleService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { StatusBadge } from '../components/StatusBadge';
import { TableSkeleton } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { Wrench, Calendar, DollarSign, ClipboardCheck, ArrowRight, Plus, Eye, Edit2 } from 'lucide-react';
import { Drawer } from '../components/Drawer';

export const Maintenance = () => {
  const { showSuccess, showError, addNotification } = useApp();
  
  // States
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'Engine Tune-up',
    date: '2026-07-11',
    cost: '',
    notes: '',
    status: 'In Progress'
  });
  const [formErrors, setFormErrors] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Resources
  const loadResources = async () => {
    setLoading(true);
    try {
      const [vList, mList] = await Promise.all([
        vehicleService.getAll(),
        maintenanceService.getAll()
      ]);
      setVehicles(vList);
      setMaintenanceLogs(mList);
    } catch (err) {
      showError('Could not fetch maintenance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.vehicleId) errors.vehicleId = 'Please select a vehicle.';
    if (!formData.date) errors.date = 'Maintenance date is required.';
    if (!formData.cost || Number(formData.cost) < 0) {
      errors.cost = 'Please enter a valid maintenance cost amount.';
    }
    if (!formData.notes.trim()) errors.notes = 'Service notes are required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOpenAdd = () => {
    setFormMode('create');
    setFormData({
      vehicleId: '',
      type: 'Engine Tune-up',
      date: '2026-07-11',
      cost: '450',
      notes: '',
      status: 'In Progress'
    });
    setFormErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (log) => {
    setFormMode('edit');
    setSelectedLog(log);
    setFormData({
      vehicleId: log.vehicleId,
      type: log.type,
      date: log.date,
      cost: log.cost,
      notes: log.notes,
      status: log.status
    });
    setFormErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenDetail = (log) => {
    setSelectedLog(log);
    setIsDetailDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        cost: Number(formData.cost)
      };

      if (formMode === 'create') {
        await maintenanceService.create(payload);
        showSuccess('New workshop maintenance logged.');
        const v = vehicles.find(item => item.id === formData.vehicleId);
        addNotification(`Vehicle ${v?.registrationNo || ''} dispatched to maintenance shop: ${formData.type}`);
      } else {
        await maintenanceService.update(selectedLog.id, payload);
        showSuccess('Maintenance log updated.');
        addNotification(`Maintenance log modified for service: ${formData.type}`);
      }
      setIsDrawerOpen(false);
      loadResources();
    } catch (err) {
      showError('Could not record maintenance logs.');
    }
  };

  const getVehicleRegNo = (vId) => {
    const v = vehicles.find(item => item.id === vId);
    return v ? v.registrationNo : 'Unknown';
  };

  const getVehicleName = (vId) => {
    const v = vehicles.find(item => item.id === vId);
    return v ? v.name : 'Unknown';
  };

  // Slice paginated logs
  const paginatedLogs = [...maintenanceLogs].reverse().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Operational Integrity</p>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Workshop Maintenance Logs</h2>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" icon={Plus}>
          Log Maintenance Work
        </Button>
      </div>

      {/* SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Workshop Repairs</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {maintenanceLogs.filter(m => m.status !== 'Completed').length} Vehicles
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Completed Services (MTD)</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {maintenanceLogs.filter(m => m.status === 'Completed').length} Logs
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Accumulated Workshop Cost</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-0.5">
              ${maintenanceLogs.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* MAINTENANCE LOGS TABLE */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : maintenanceLogs.length === 0 ? (
        <EmptyState
          title="No maintenance logged"
          description="Vehicles are operating inside safety limits. Register a new workshop entry if any repair is allocated."
          actionLabel="Log Maintenance"
          onActionClick={handleOpenAdd}
        />
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-slate-700 font-medium">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Vehicle Reg</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Service Type</th>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Expenses Cost</th>
                  <th className="px-6 py-4">Service Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 tracking-tight">{getVehicleRegNo(log.vehicleId)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{getVehicleName(log.vehicleId)}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{log.type}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{log.date}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">${Number(log.cost || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => handleOpenDetail(log)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer transition-colors"
                          title="View Service Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(log)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg cursor-pointer transition-colors"
                          title="Modify Service Log"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={maintenanceLogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* ADD/EDIT DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        title={formMode === 'create' ? 'Schedule Workshop Service' : 'Modify Maintenance Log'}
        onClose={() => setIsDrawerOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Select
            id="maint-vehicle"
            label="Target Fleet Vehicle"
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleInputChange}
            options={[
              { value: '', label: '-- Choose Vehicle --' },
              ...vehicles.map(v => ({ value: v.id, label: `${v.registrationNo} - ${v.name}` }))
            ]}
            error={formErrors.vehicleId}
            required
            disabled={formMode === 'edit'}
          />

          <Select
            id="maint-type"
            label="Service Job Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            options={[
              { value: 'Engine Tune-up', label: 'Engine Tune-up' },
              { value: 'Brake Replacement', label: 'Brake Replacement' },
              { value: 'Tire Rotation', label: 'Tire Rotation' },
              { value: 'Oil Change', label: 'Oil Change' },
              { value: 'Electrical Repair', label: 'Electrical Repair' },
              { value: 'Body / Frame work', label: 'Body / Frame work' }
            ]}
          />

          <Input
            id="maint-date"
            label="Job Scheduled Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            error={formErrors.date}
            required
          />

          <Input
            id="maint-cost"
            label="Accrued Job Cost ($)"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleInputChange}
            placeholder="e.g. 350"
            error={formErrors.cost}
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-slate-700">Service Notes / Remarks</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Provide exact diagnostics or replacement remarks here..."
              className={`block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm ${
                formErrors.notes ? 'border-red-300' : ''
              }`}
            />
            {formErrors.notes && <p className="text-xs text-red-600 font-medium">{formErrors.notes}</p>}
          </div>

          <Select
            id="maint-status"
            label="Job Workshop Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />

          <div className="flex gap-3 justify-end border-t border-slate-100 pt-5 mt-4">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {formMode === 'create' ? 'Record Job Log' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* SERVICE DETAIL VIEW */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        title="Maintenance Job Sheet"
        onClose={() => setIsDetailDrawerOpen(false)}
      >
        {selectedLog && (
          <div className="flex flex-col gap-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Target Vehicle</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{getVehicleRegNo(selectedLog.vehicleId)}</span>
                <span className="text-xs text-slate-500">{getVehicleName(selectedLog.vehicleId)}</span>
              </div>
              <StatusBadge status={selectedLog.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Service Type</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedLog.type}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Job Expense</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">${Number(selectedLog.cost || 0).toLocaleString()}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Date</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedLog.date}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Diagnostics & Notes</span>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{selectedLog.notes}</p>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5 mt-4">
              <Button variant="primary" onClick={() => setIsDetailDrawerOpen(false)}>
                Close Sheet
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
