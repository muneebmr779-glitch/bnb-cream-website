import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Wrench, Search } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getServiceIcon } from '../../utils/iconMap';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import {
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} from '../../services/serviceService';
import { getErrorMessage } from '../../services/api';
import { required } from '../../utils/validators';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  duration: '',
  category: 'maintenance',
  isPopular: false,
  isActive: true,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getAllServicesAdmin({ search })
      .then((res) => setServices(res.services))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditing(service);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      isPopular: service.isPopular,
      isActive: service.isActive,
    });
    setImageFile(null);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const next = {};
    if (!required(form.name)) next.name = 'Service name is required';
    if (!required(form.description)) next.description = 'Description is required';
    if (!form.price || Number(form.price) < 0) next.price = 'Enter a valid price';
    if (!required(form.duration)) next.duration = 'Estimated duration is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append('image', imageFile);

    setSubmitting(true);
    try {
      if (editing) {
        await updateService(editing._id, formData);
        toast.success('Service updated');
      } else {
        await createService(formData);
        toast.success('Service created');
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
      await deleteService(deleteTarget._id);
      toast.success('Service deleted');
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
      <PageMeta title="Manage Services" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Services</h1>
        <button type="button" onClick={openAddModal} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="relative mt-5 w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..." className="input pl-10" />
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading services..." />
        ) : services.length === 0 ? (
          <EmptyState icon={Wrench} title="No services found" description="Add your first service to get started." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <div key={service._id} className="card p-5">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={`badge ${service.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-charcoal-100 text-charcoal-500 dark:bg-charcoal-800'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display font-bold">{service.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-charcoal-500 dark:text-charcoal-400">{service.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-bold text-accent-600">${service.price}</span>
                    <span className="text-charcoal-400">{service.duration}</span>
                  </div>
                  <div className="mt-4 flex gap-2 border-t border-charcoal-100 pt-4 dark:border-charcoal-800">
                    <button type="button" onClick={() => openEditModal(service)} className="btn-outline flex-1 px-3 py-2 text-xs">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button type="button" onClick={() => setDeleteTarget(service)} className="btn-ghost px-3 py-2 text-xs text-accent-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Service Name</label>
            <input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input resize-none" />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="price">Starting Price ($)</label>
              <input id="price" type="number" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="input" />
              {errors.price && <p className="field-error">{errors.price}</p>}
            </div>
            <div>
              <label className="label" htmlFor="duration">Estimated Duration</label>
              <input id="duration" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} className="input" placeholder="e.g. 1-2 hours" />
              {errors.duration && <p className="field-error">{errors.duration}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input">
                {SERVICE_CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="image">Service Image</label>
              <input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input file:mr-3 file:rounded-lg file:border-0 file:bg-accent-600 file:px-3 file:py-1.5 file:text-white" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm((p) => ({ ...p, isPopular: e.target.checked }))} className="rounded border-charcoal-300 text-accent-600 focus:ring-accent-500" />
              Mark as Popular
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded border-charcoal-300 text-accent-600 focus:ring-accent-500" />
              Active
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </>
  );
};

export default AdminServices;
