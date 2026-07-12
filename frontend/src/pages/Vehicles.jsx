import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { vehicleService } from '../services/vehicleService';
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
import { Plus, Search, Filter, Eye, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export const Vehicles = () => {
  const { showSuccess, showError, addNotification } = useApp();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

  // Form State
  const [formData, setFormData] = useState({
    registrationNo: '',
    name: '',
    type: 'Heavy Truck',
    capacity: '',
    odometer: '',
    cost: '',
    status: 'Available'
  });

  const [formErrors, setFormErrors] = useState({});

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      showError('Could not retrieve vehicle logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = [...vehicles];

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.registrationNo.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)
      );
    }

    // Type Filter
    if (typeFilter !== 'All') {
      result = result.filter(v => v.type === typeFilter);
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(v => v.status === statusFilter);
    }

    setFilteredVehicles(result);
    setCurrentPage(1); // Reset page on filter
  }, [vehicles, searchQuery, typeFilter, statusFilter]);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.registrationNo.trim()) {
      errors.registrationNo = 'Registration number is required.';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.registrationNo)) {
      errors.registrationNo = 'Alphanumeric and hyphens only.';
    }

    if (!formData.name.trim()) errors.name = 'Vehicle name is required.';
    if (!formData.capacity.trim()) errors.capacity = 'Max payload capacity is required.';
    if (!formData.odometer) {
      errors.odometer = 'Odometer reading is required.';
    } else if (Number(formData.odometer) < 0) {
      errors.odometer = 'Odometer cannot be negative.';
    }

    if (!formData.cost) {
      errors.cost = 'Acquisition cost is required.';
    } else if (Number(formData.cost) < 0) {
      errors.cost = 'Cost cannot be negative.';
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
      registrationNo: '',
      name: '',
      type: 'Heavy Truck',
      capacity: '20 Tons',
      odometer: '12000',
      cost: '125000',
      status: 'Available'
    });
    setFormErrors({});
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (vehicle) => {
    setFormMode('edit');
    setSelectedVehicle(vehicle);
    setFormData({
      registrationNo: vehicle.registrationNo,
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      cost: vehicle.cost,
      status: vehicle.status
    });
    setFormErrors({});
    setIsDrawerOpen(true);
  };

  // Open Detail Drawer
  const handleOpenDetail = (vehicle) => {
    setSelectedVehicle(vehicle);
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
          odometer: Number(formData.odometer),
          cost: Number(formData.cost)
        };
        await vehicleService.create(payload);
        showSuccess(`Vehicle ${formData.registrationNo} created successfully.`);
        addNotification(`New vehicle ${formData.name} (${formData.registrationNo}) registered in fleet`);
      } else {
        const payload = {
          ...formData,
          odometer: Number(formData.odometer),
          cost: Number(formData.cost)
        };
        await vehicleService.update(selectedVehicle.id, payload);
        showSuccess(`Vehicle ${formData.registrationNo} updated successfully.`);
        addNotification(`Vehicle ${formData.registrationNo} details modified`);
      }
      setIsDrawerOpen(false);
      fetchVehicles();
    } catch (err) {
      showError('Could not process vehicle operation.');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await vehicleService.delete(vehicleToDelete.id);
      showSuccess(`Vehicle ${vehicleToDelete.registrationNo} decommissioned.`);
      addNotification(`Vehicle ${vehicleToDelete.name} (${vehicleToDelete.registrationNo}) removed from system`);
      setIsDeleteModalOpen(false);
      fetchVehicles();
    } catch (err) {
      showError('Could not delete vehicle. Verify it has no running trips.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination Slice
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Fleet Assets</p>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Vehicle Registry</h2>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" icon={Plus}>
          Add New Vehicle
        </Button>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="glass-card border border-slate-200/80 rounded-2xl p-5 shadow-premium flex flex-wrap gap-4 items-center justify-between">
        <SearchBar
          id="vehicle-search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search registration no, model name..."
        />
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter By:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-4 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-slate-300 hover:shadow-md"
          >
            <option value="All">Type: All</option>
            <option value="Heavy Truck">Heavy Truck</option>
            <option value="Electric Semi">Electric Semi</option>
            <option value="Box Truck">Box Truck</option>
            <option value="Cargo Van">Cargo Van</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-4 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-slate-300 hover:shadow-md"
          >
            <option value="All">Status: All</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* REGISTRY DATA TABLE */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filteredVehicles.length === 0 ? (
        <EmptyState
          title="No vehicles found"
          description="We couldn't find any vehicles matching your search queries or filters. Register a new asset to get started."
          actionLabel="Register Vehicle"
          onActionClick={handleOpenAdd}
        />
      ) : (
        <div className="glass-card border border-slate-200/80 rounded-2xl shadow-premium overflow-hidden flex flex-col animate-slide-up">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Reg No</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Classification</th>
                  <th className="px-6 py-4">Max Payload</th>
                  <th className="px-6 py-4">Odometer</th>
                  <th className="px-6 py-4">Acquisition Cost</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-violet-50/30 transition-all duration-300 group">
                    <td className="px-6 py-4 font-bold text-slate-800 tracking-tight">{vehicle.registrationNo}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{vehicle.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                        {vehicle.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{vehicle.capacity}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">{vehicle.odometer.toLocaleString()} km</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${vehicle.cost.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => handleOpenDetail(vehicle)}
                          className="p-2 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md group-hover:scale-105"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(vehicle)}
                          className="p-2 hover:bg-violet-50 text-slate-500 hover:text-violet-600 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md group-hover:scale-105"
                          title="Modify Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(vehicle)}
                          className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md group-hover:scale-105"
                          title="Decommission Asset"
                          disabled={vehicle.status === 'On Trip'}
                        >
                          <Trash2 className={`w-4 h-4 ${vehicle.status === 'On Trip' ? 'opacity-30' : ''}`} />
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
            totalItems={filteredVehicles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* ADD/EDIT DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        title={formMode === 'create' ? 'Register New Fleet Asset' : 'Edit Asset Configuration'}
        onClose={() => setIsDrawerOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="vehicle-reg"
            label="Registration plate number"
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleInputChange}
            placeholder="e.g. TX-9922"
            error={formErrors.registrationNo}
            required
            disabled={formMode === 'edit'}
          />

          <Input
            id="vehicle-name"
            label="Vehicle manufacturer & model"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Tesla Semi"
            error={formErrors.name}
            required
          />

          <Select
            id="vehicle-type"
            label="Classification"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            options={[
              { value: 'Heavy Truck', label: 'Heavy Truck' },
              { value: 'Electric Semi', label: 'Electric Semi' },
              { value: 'Box Truck', label: 'Box Truck' },
              { value: 'Light Duty', label: 'Light Duty' },
              { value: 'Cargo Van', label: 'Cargo Van' }
            ]}
          />

          <Input
            id="vehicle-capacity"
            label="Max Payload Weight Capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            placeholder="e.g. 20 Tons"
            error={formErrors.capacity}
            required
          />

          <Input
            id="vehicle-odometer"
            label="Current Odometer Reading (km)"
            name="odometer"
            type="number"
            value={formData.odometer}
            onChange={handleInputChange}
            placeholder="e.g. 45000"
            error={formErrors.odometer}
            required
          />

          <Input
            id="vehicle-cost"
            label="Acquisition Cost ($)"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleInputChange}
            placeholder="e.g. 145000"
            error={formErrors.cost}
            required
          />

          <Select
            id="vehicle-status"
            label="Operational Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'In Shop', label: 'In Shop' },
              { value: 'Retired', label: 'Retired' }
            ]}
          />

          <div className="flex gap-3 justify-end border-t border-slate-100 pt-5 mt-4">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {formMode === 'create' ? 'Register Asset' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* DETAIL VIEW DRAWER */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        title="Vehicle Operational Record"
        onClose={() => setIsDetailDrawerOpen(false)}
      >
        {selectedVehicle && (
          <div className="flex flex-col gap-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Asset Plate</span>
                <span className="text-xl font-black text-slate-800 tracking-tight">{selectedVehicle.registrationNo}</span>
              </div>
              <StatusBadge status={selectedVehicle.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manufacturer</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedVehicle.name}</span>
              </div>
              
              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedVehicle.type}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payload Limit</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedVehicle.capacity}</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Odometer log</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">{selectedVehicle.odometer.toLocaleString()} km</span>
              </div>

              <div className="flex flex-col p-3 border border-slate-100 rounded-xl col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capital Investment</span>
                <span className="text-sm font-semibold text-slate-800 mt-1">${selectedVehicle.cost.toLocaleString()}</span>
              </div>
            </div>

            {/* Business Rules warnings inside view details */}
            {selectedVehicle.status === 'In Shop' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-amber-800">
                  <span className="font-bold">Workshop Allocation Locked</span>
                  <p className="mt-0.5 leading-normal">This vehicle is marked as 'In Shop' and cannot be dispatched or assigned to trips until maintenance logs are set to 'Completed'.</p>
                </div>
              </div>
            )}

            {selectedVehicle.status === 'Retired' && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0" />
                <div className="text-slate-600">
                  <span className="font-bold">Asset Retired</span>
                  <p className="mt-0.5 leading-normal">This vehicle is decommissioned from service. No further actions can be registered except static logging.</p>
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
        message={`Are you sure you want to decommission and delete ${vehicleToDelete?.name} (${vehicleToDelete?.registrationNo}) from the active registry database? This is irreversible.`}
        confirmLabel="Decommission"
        cancelLabel="Keep Asset"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};
