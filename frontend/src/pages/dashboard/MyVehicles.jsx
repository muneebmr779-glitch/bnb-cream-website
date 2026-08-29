import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Car, Plus, Pencil, Trash2 } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getMyVehicles, addVehicle, updateVehicle, deleteVehicle } from '../../services/vehicleService';
import { getErrorMessage } from '../../services/api';
import { required, isValidYear } from '../../utils/validators';

const emptyForm = { make: '', model: '', year: '', registrationNumber: '' };

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getMyVehicles()
      .then((res) => setVehicles(res.vehicles))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditing(vehicle);
    setForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      registrationNumber: vehicle.registrationNumber,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const next = {};
    if (!required(form.make)) next.make = 'Make is required';
    if (!required(form.model)) next.model = 'Model is required';
    if (!isValidYear(form.year)) next.year = 'Enter a valid year';
    if (!required(form.registrationNumber)) next.registrationNumber = 'Registration number is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = { ...form, year: Number(form.year) };
      if (editing) {
        await updateVehicle(editing._id, payload);
        toast.success('Vehicle updated');
      } else {
        await addVehicle(payload);
        toast.success('Vehicle added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteVehicle(deleteTarget._id);
      toast.success('Vehicle removed');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="My Vehicles" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">My Vehicles</h1>
        <button type="button" onClick={openAddModal} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading your vehicles..." />
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No vehicles added yet"
            description="Add a vehicle to speed up your next booking."
            action={<button type="button" onClick={openAddModal} className="btn-primary">Add Vehicle</button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="card flex items-start justify-between p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                    <Car className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    <p className="mt-0.5 text-sm text-charcoal-500 dark:text-charcoal-400">
                      Reg: {vehicle.registrationNumber}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(vehicle)}
                    className="rounded-lg p-2 text-charcoal-400 hover:bg-charcoal-100 hover:text-charcoal-700 dark:hover:bg-charcoal-800"
                    aria-label="Edit vehicle"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(vehicle)}
                    className="rounded-lg p-2 text-charcoal-400 hover:bg-accent-50 hover:text-accent-600 dark:hover:bg-accent-500/10"
                    aria-label="Delete vehicle"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Vehicle' : 'Add Vehicle'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="make">Make</label>
              <input id="make" value={form.make} onChange={(e) => setForm((p) => ({ ...p, make: e.target.value }))} className="input" placeholder="Toyota" />
              {errors.make && <p className="field-error">{errors.make}</p>}
            </div>
            <div>
              <label className="label" htmlFor="model">Model</label>
              <input id="model" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} className="input" placeholder="Corolla" />
              {errors.model && <p className="field-error">{errors.model}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="year">Year</label>
              <input id="year" type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} className="input" placeholder="2020" />
              {errors.year && <p className="field-error">{errors.year}</p>}
            </div>
            <div>
              <label className="label" htmlFor="registrationNumber">Registration No.</label>
              <input id="registrationNumber" value={form.registrationNumber} onChange={(e) => setForm((p) => ({ ...p, registrationNumber: e.target.value }))} className="input" placeholder="ABC-1234" />
              {errors.registrationNumber && <p className="field-error">{errors.registrationNumber}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message={`Remove ${deleteTarget?.make} ${deleteTarget?.model} (${deleteTarget?.registrationNumber}) from your account?`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </>
  );
};

export default MyVehicles;
