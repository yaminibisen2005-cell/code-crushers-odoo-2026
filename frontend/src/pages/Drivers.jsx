import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { driverService } from '../services/driverService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Drawer } from '../components/Drawer';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { StatusBadge } from '../components/StatusBadge';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { TableSkeleton } from '../components/LoadingSpinner';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Award, CalendarClock, ShieldAlert } from 'lucide-react';

export const Drivers = () => {
  const { showSuccess, showError, addNotification } = useApp();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    licenseNo: '',
    category: 'Class A CDL',
    expiryDate: '',
    phone: '',
    safetyScore: '',
    status: 'Available'
  });

  const [formErrors, setFormErrors] = useState({});

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Current Date for License Check
  const TODAY_STR = '2026-07-11';
  const TODAY = new Date(TODAY_STR);

  // Load Drivers
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (err) {
      showError('Could not retrieve driver records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = [...drivers];

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.licenseNo.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter(d => d.category === categoryFilter);
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(d => d.status === statusFilter);
    }

    setFilteredDrivers(result);
    setCurrentPage(1); // Reset page
  }, [drivers, searchQuery, categoryFilter, statusFilter]);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Driver name is required.';
    if (!formData.licenseNo.trim()) {
      errors.licenseNo = 'License number is required.';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.licenseNo)) {
      errors.licenseNo = 'Valid license characters only.';
    }

    if (!formData.expiryDate) {
      errors.expiryDate = 'License expiration date is required.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9-\s()]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format.';
    }

    if (!formData.safetyScore) {
      errors.safetyScore = 'Safety score rating is required.';
    } else {
      const score = Number(formData.safetyScore);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.safetyScore = 'Safety score must be a number between 0 and 100.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error on type
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Open Add Drawer
  const handleOpenAdd = () => {
    setFormMode('create');
    setFormData({
      name: '',
      licenseNo: '',
      category: 'Class A CDL',
      expiryDate: '2027-12-15',
      phone: '+1-555-0100',
      safetyScore: '95',
      status: 'Available'
    });
    setFormErrors({});
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (driver) => {
    setFormMode('edit');
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      licenseNo: driver.licenseNo,
      category: driver.category,
      expiryDate: driver.expiryDate,
      phone: driver.phone,
      safetyScore: driver.safetyScore,
      status: driver.status
    });
    setFormErrors({});
    setIsDrawerOpen(true);
  };

  // Open Detail Drawer
  const handleOpenDetail = (driver) => {
    setSelectedDriver(driver);
    setIsDetailDrawerOpen(true);
  };

  // Submit Drawer Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (formMode === 'create') {
        const payload = {
          ...formData,
          safetyScore: Number(formData.safetyScore)
        };
        await driverService.create(payload);
        showSuccess(`Driver profile for ${formData.name} created.`);
        addNotification(`New driver ${formData.name} added to operations list`);
      } else {
        const payload = {
          ...formData,
          safetyScore: Number(formData.safetyScore)
        };
        await driverService.update(selectedDriver.id, payload);
        showSuccess(`Driver profile for ${formData.name} updated.`);
        addNotification(`Driver ${formData.name} profile modified`);
      }
      setIsDrawerOpen(false);
      fetchDrivers();
    } catch (err) {
      showError('Could not process driver profile.');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (driver) => {
    setDriverToDelete(driver);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await driverService.delete(driverToDelete.id);
      showSuccess(`Driver ${driverToDelete.name} deleted.`);
      addNotification(`Driver ${driverToDelete.name} removed from system logs`);
      setIsDeleteModalOpen(false);
      fetchDrivers();
    } catch (err) {
      showError('Could not delete driver records.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isLicenseExpired = (expiryDate) => {
    return new Date(expiryDate) < TODAY;
  };

  // Pagination Slice
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Human Resources</p>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Driver Profiles</h2>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" icon={Plus}>
          Add New Driver
        </Button>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <SearchBar
          id="driver-search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search driver name, license CDL, phone..."
        />
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Filter By:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
          >
            <option value="All">Classification: All</option>
            <option value="Class A CDL">Class A CDL</option>
            <option value="Class B CDL">Class B CDL</option>
            <option value="Standard Class C">Standard Class C</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
          >
            <option value="All">Availability: All</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* DRIVERS PROFILE DATA TABLE */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filteredDrivers.length === 0 ? (
        <EmptyState
          title="No drivers found"
          description="We couldn't find any drivers matching your search queries or filters. Register a new driver profile to schedule dispatches."
          actionLabel="Add Driver"
          onActionClick={handleOpenAdd}
        />
      ) : (
        <div className="bg-white border border-[#E5EEF8] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-slate-700 font-medium">
              <thead className="bg-[#F7FAFC] border-b border-[#E5EEF8] text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Driver Name</th>
                  <th className="px-6 py-4">License No</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">License Expiration</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Safety Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EEF8]">
                {paginatedDrivers.map((driver) => {
                  const expired = isLicenseExpired(driver.expiryDate);
                  return (
                    <tr key={driver.id} className={`hover:bg-[#27D7FF]/5 transition-colors ${expired ? 'bg-red-50/10' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#12263F] tracking-tight">{driver.name}</span>
                          <span className="text-[10px] text-[#64748B] mt-0.5">UID: {driver.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[#12263F] text-xs">{driver.licenseNo}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-[#12263F] text-xs font-bold">
                          {driver.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${expired ? 'text-[#EF4444] font-bold' : 'text-[#12263F]'}`}>
                            {driver.expiryDate}
                          </span>
                          {expired && (
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 animate-pulse">
                              EXPIRED
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#64748B] text-xs">{driver.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                            driver.safetyScore >= 90 ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                            driver.safetyScore >= 80 ? 'bg-[#0F6FFF]/10 text-[#0F6FFF]' :
                            'bg-[#EF4444]/10 text-[#EF4444]'
                          }`}>
                            {driver.safetyScore}%
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                            <div 
                              className={`h-1.5 rounded-full ${
                                driver.safetyScore >= 90 ? 'bg-[#22C55E]' :
                                driver.safetyScore >= 80 ? 'bg-[#0F6FFF]' :
                                'bg-[#EF4444]'
                              }`} 
                              style={{ width: `${driver.safetyScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={driver.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => handleOpenDetail(driver)}
                            className="p-1.5 hover:bg-slate-100 text-[#64748B] hover:text-[#12263F] rounded-lg cursor-pointer transition-colors"
                            title="View Safety Sheet"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(driver)}
                            className="p-1.5 hover:bg-slate-100 text-[#64748B] hover:text-[#0F6FFF] rounded-lg cursor-pointer transition-colors"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(driver)}
                            className="p-1.5 hover:bg-slate-100 text-[#64748B] hover:text-[#EF4444] rounded-lg cursor-pointer transition-colors"
                            title="Delete Record"
                            disabled={driver.status === 'On Trip'}
                          >
                            <Trash2 className={`w-4 h-4 ${driver.status === 'On Trip' ? 'opacity-30' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredDrivers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* ADD/EDIT DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        title={formMode === 'create' ? 'Onboard New Operator' : 'Edit Operator Configuration'}
        onClose={() => setIsDrawerOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="driver-name"
            label="Full Operator Legal Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Douglas Miller"
            error={formErrors.name}
            required
          />

          <Input
            id="driver-license"
            label="Commercial Driver License (CDL) #"
            name="licenseNo"
            value={formData.licenseNo}
            onChange={handleInputChange}
            placeholder="e.g. DL-99212"
            error={formErrors.licenseNo}
            required
          />

          <Select
            id="driver-category"
            label="License CDL Classification"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={[
              { value: 'Class A CDL', label: 'Class A CDL (Heavy combination)' },
              { value: 'Class B CDL', label: 'Class B CDL (Single heavy truck)' },
              { value: 'Standard Class C', label: 'Standard Class C (Light vehicles)' }
            ]}
          />

          <Input
            id="driver-expiry"
            label="CDL Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleInputChange}
            error={formErrors.expiryDate}
            required
          />

          <Input
            id="driver-phone"
            label="Mobile Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="e.g. +1-555-0192"
            error={formErrors.phone}
            required
          />

          <Input
            id="driver-safety"
            label="Historical Safety Score (%)"
            name="safetyScore"
            type="number"
            value={formData.safetyScore}
            onChange={handleInputChange}
            placeholder="e.g. 95"
            error={formErrors.safetyScore}
            required
          />

          <Select
            id="driver-status"
            label="Operational Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'Suspended', label: 'Suspended' }
            ]}
          />

          <div className="flex gap-3 justify-end border-t border-slate-100 pt-5 mt-4">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {formMode === 'create' ? 'Onboard Operator' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* DETAIL SAFETY PROFILE VIEW */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        title="Operator Safety & License profile"
        onClose={() => setIsDetailDrawerOpen(false)}
      >
        {selectedDriver && (
          <div className="flex flex-col gap-6">
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assigned Operator</span>
                <StatusBadge status={selectedDriver.status} />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">{selectedDriver.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CDL License Number</span>
                <span className="text-sm font-semibold font-mono text-slate-800 mt-1">{selectedDriver.licenseNo}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">License Type</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedDriver.category}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">License Expiration</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedDriver.expiryDate}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Phone</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedDriver.phone}</span>
              </div>

              {/* Safety metrics block */}
              <div className="flex flex-col p-4 bg-slate-900 border border-slate-950 rounded-2xl col-span-2 text-white shadow-md relative overflow-hidden">
                <Award className="absolute -bottom-2 -right-2 w-24 h-24 text-slate-800/60 pointer-events-none" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safety Rating & Quality score</span>
                <span className="text-2xl font-black text-white mt-1.5">{selectedDriver.safetyScore}% Rating</span>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed z-10 max-w-[210px]">
                  Based on speed limits compliance, incident history, route delivery timings and fuel savings behaviors.
                </p>
              </div>
            </div>

            {/* Check license expiration */}
            {isLicenseExpired(selectedDriver.expiryDate) && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                <div className="text-red-800">
                  <span className="font-bold">CDL License Expired</span>
                  <p className="mt-0.5 leading-normal">This operator has an expired commercial license. In accordance with transportation regulations, they cannot be selected for trip dispatching.</p>
                </div>
              </div>
            )}

            {selectedDriver.status === 'Suspended' && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                <div className="text-red-800">
                  <span className="font-bold">Operator Suspended</span>
                  <p className="mt-0.5 leading-normal">This operator profile is suspended due to safety or administrative reviews. De-selected from all operations routing.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-5 mt-4">
              <Button variant="primary" onClick={() => setIsDetailDrawerOpen(false)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Decommissioning"
        message={`Are you sure you want to delete Douglas profile from TransitOps? This will clear historical safety scoring parameters.`}
        confirmLabel="Remove Operator"
        cancelLabel="Keep Profile"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};
