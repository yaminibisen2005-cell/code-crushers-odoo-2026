import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fuelService } from "../services/fuelService";
import { vehicleService } from "../services/vehicleService";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { TableSkeleton } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";
import { ConfirmationModal } from "../components/ConfirmationModal";
import {
  Fuel,
  DollarSign,
  Calendar,
  Flame,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

export const FuelExpense = () => {
  const { showSuccess, showError, addNotification } = useApp();

  // States
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [formData, setFormData] = useState({
    vehicleId: "",
    date: "2026-07-11",
    liters: "",
    cost: "",
    expenseType: "Fuel Fill",
    amount: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Resources
  const loadResources = async () => {
    setLoading(true);
    try {
      const [vList, fList] = await Promise.all([
        vehicleService.getAll(),
        fuelService.getAll(),
      ]);
      setVehicles(vList);
      setExpenses(fList);
    } catch (err) {
      showError("Could not fetch financial records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.vehicleId) errors.vehicleId = "Please select a vehicle.";
    if (!formData.date) errors.date = "Record date is required.";

    if (formData.expenseType === "Fuel Fill") {
      if (!formData.liters || Number(formData.liters) <= 0) {
        errors.liters = "Liters amount is required.";
      }
      if (!formData.cost || Number(formData.cost) <= 0) {
        errors.cost = "Fuel cost amount is required.";
      }
    } else {
      if (!formData.amount || Number(formData.amount) <= 0) {
        errors.amount = "Expense amount is required.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Structure pay-load based on type
      let payload = {};
      if (formData.expenseType === "Fuel Fill") {
        payload = {
          vehicleId: formData.vehicleId,
          date: formData.date,
          liters: Number(formData.liters),
          cost: Number(formData.cost),
          expenseType: "Fuel Fill",
          amount: Number(formData.cost), // Fuel expense size matches cost
        };
      } else {
        payload = {
          vehicleId: formData.vehicleId,
          date: formData.date,
          liters: 0,
          cost: 0,
          expenseType: formData.expenseType,
          amount: Number(formData.amount),
        };
      }

      await fuelService.create(payload);
      showSuccess(`Operational expense logged successfully.`);
      const v = vehicles.find((item) => item.id === formData.vehicleId);
      addNotification(
        `New logistical expense logged: ${formData.expenseType} for vehicle ${v?.registrationNo || ""}`,
      );

      // Reset form
      setFormData({
        vehicleId: "",
        date: "2026-07-11",
        liters: "",
        cost: "",
        expenseType: "Fuel Fill",
        amount: "",
      });
      loadResources();
    } catch (err) {
      showError("Could not write financial data.");
    }
  };

  const handleOpenDelete = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await fuelService.delete(expenseToDelete.id);
      showSuccess("Operational expense record cleared.");
      addNotification(
        `Expense ledger cleared for: ${expenseToDelete.expenseType}`,
      );
      setIsDeleteModalOpen(false);
      loadResources();
    } catch (err) {
      showError("Could not remove financial records.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getVehicleRegNo = (vId) => {
    const v = vehicles.find((item) => item.id === vId);
    return v ? v.registrationNo : "Unknown";
  };

  // Operational costs accumulated
  const fuelCostsTotal = expenses.reduce((acc, curr) => {
    const amount = Number(
      curr?.expenseType === "Fuel Fill" ? (curr?.amount ?? curr?.cost ?? 0) : 0,
    );
    return acc + amount;
  }, 0);
  const otherCostsTotal = expenses.reduce((acc, curr) => {
    const amount = Number(
      curr?.expenseType !== "Fuel Fill" ? (curr?.amount ?? curr?.cost ?? 0) : 0,
    );
    return acc + amount;
  }, 0);
  const combinedCostsTotal = fuelCostsTotal + otherCostsTotal;
  const totalLiters = expenses.reduce(
    (acc, curr) => acc + Number(curr?.liters ?? 0),
    0,
  );

  // Pagination slice
  const paginatedExpenses = [...expenses]
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Financial Accounts
        </p>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Fuel logs & Operating Expenses
        </h2>
      </div>

      {/* OPERATIONAL COST SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Combined Fuel Expenses
            </span>
            <span className="text-2xl font-black text-slate-800">
              ${fuelCostsTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Total liters: {totalLiters.toLocaleString()} Liters
            </span>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Fuel className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Tolls, Fees & Permits
            </span>
            <span className="text-2xl font-black text-slate-800">
              ${otherCostsTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Total miscellaneous expense lines
            </span>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Total Combined Outlay
            </span>
            <span className="text-2xl font-black text-slate-800">
              ${combinedCostsTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold mt-1">
              Active Logistics Accounts
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SPLIT COLUMN DETAILS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ADD LOG */}
        <div className="xl:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-800">
                Record Operational Expense
              </h4>
              <span className="text-xs text-slate-400">
                Log cargo run costs and fuel refills
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Select
              id="expense-vehicle"
              label="Fleet Vehicle"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleInputChange}
              options={[
                { value: "", label: "-- Choose Vehicle --" },
                ...vehicles.map((v) => ({
                  value: v.id,
                  label: `${v.registrationNo} - ${v.name}`,
                })),
              ]}
              error={formErrors.vehicleId}
              required
            />

            <Select
              id="expense-type"
              label="Expense Classification"
              name="expenseType"
              value={formData.expenseType}
              onChange={handleInputChange}
              options={[
                { value: "Fuel Fill", label: "Fuel Fill Log" },
                { value: "Tolls", label: "Route Toll Fees" },
                { value: "Permits", label: "Transit Permits" },
                { value: "Insurance", label: "Liability / Coverage" },
                { value: "Parking", label: "Depot Parking fees" },
              ]}
            />

            <Input
              id="expense-date"
              label="Transaction Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              error={formErrors.date}
              required
            />

            {formData.expenseType === "Fuel Fill" ? (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="fuel-liters"
                  label="Fuel Volume (Liters)"
                  name="liters"
                  type="number"
                  value={formData.liters}
                  onChange={handleInputChange}
                  placeholder="e.g. 120"
                  error={formErrors.liters}
                  required
                />
                <Input
                  id="fuel-cost"
                  label="Fuel Cost ($)"
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="e.g. 180"
                  error={formErrors.cost}
                  required
                />
              </div>
            ) : (
              <Input
                id="expense-amount"
                label="Expense Amount ($)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="e.g. 45"
                error={formErrors.amount}
                required
              />
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 rounded-xl font-bold mt-2"
            >
              Record Outlay Entry
            </Button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIST LOGS */}
        <div className="xl:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4.5 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800">
              Operational Expenses Registry
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Listing of registered financial logs and route transactions
            </p>
          </div>

          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} />
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No expense entries found" />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm text-slate-700 font-medium">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Vehicle Reg</th>
                      <th className="px-6 py-4">Expense Type</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Liters bought</th>
                      <th className="px-6 py-4">Ledger Cost</th>
                      <th className="px-6 py-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedExpenses.map((expense) => {
                      const displayAmount = Number(
                        expense?.amount ?? expense?.cost ?? 0,
                      );
                      const displayLiters = Number(expense?.liters ?? 0);

                      return (
                        <tr
                          key={expense.id}
                          className="hover:bg-slate-50/40 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-slate-800 tracking-tight">
                            {getVehicleRegNo(expense.vehicleId)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold border ${
                                expense.expenseType === "Fuel Fill"
                                  ? "bg-blue-50 border-blue-200 text-blue-700"
                                  : "bg-slate-100 border-slate-200 text-slate-700"
                              }`}
                            >
                              {expense.expenseType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {expense.date}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {displayLiters > 0
                              ? `${displayLiters.toLocaleString()} L`
                              : "--"}
                          </td>
                          <td className="px-6 py-4 font-extrabold text-slate-900">
                            ${displayAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleOpenDelete(expense)}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={expenses.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* DELETION CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Remove Outlay Entry"
        message={`Are you sure you want to clear this expense line of $${expenseToDelete?.amount} (${expenseToDelete?.expenseType}) from operations ledgers? This action is irreversible.`}
        confirmLabel="Clear Ledger"
        cancelLabel="Keep Record"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};
