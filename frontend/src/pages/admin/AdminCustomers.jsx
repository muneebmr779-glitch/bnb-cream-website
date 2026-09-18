import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Users, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getUsers, updateUser, deleteUser } from '../../services/userService';
import { getErrorMessage } from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getUsers({ search, page, limit: 10 })
      .then((res) => {
        setCustomers(res.users);
        setPages(res.pages || 1);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const openEditModal = (customer) => {
    setEditing(customer);
    setForm({ name: customer.name, phone: customer.phone, isActive: customer.isActive !== false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateUser(editing.id, form);
      toast.success('Customer updated');
      setEditing(null);
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
      await deleteUser(deleteTarget.id);
      toast.success('Customer deleted');
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
      <PageMeta title="Manage Customers" />
      <h1 className="font-display text-2xl font-bold">Customers</h1>

      <div className="relative mt-5 w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search customers..."
          className="input pl-10"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading customers..." />
        ) : customers.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" description="Try a different search term." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-charcoal-100 text-xs uppercase tracking-wide text-charcoal-400 dark:border-charcoal-800">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 dark:divide-charcoal-800">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-5 py-3 font-medium">{customer.name}</td>
                    <td className="px-5 py-3">{customer.email}</td>
                    <td className="px-5 py-3">{customer.phone}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${customer.isActive !== false ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-charcoal-100 text-charcoal-500 dark:bg-charcoal-800'}`}>
                        {customer.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button type="button" onClick={() => openEditModal(customer)} className="rounded-lg p-2 text-charcoal-400 hover:bg-charcoal-100 hover:text-charcoal-700 dark:hover:bg-charcoal-800" aria-label="Edit customer">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(customer)} className="rounded-lg p-2 text-charcoal-400 hover:bg-accent-50 hover:text-accent-600 dark:hover:bg-accent-500/10" aria-label="Delete customer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline px-3 py-2">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Page {page} of {pages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-outline px-3 py-2">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Customer">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="edit-name">Name</label>
            <input id="edit-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="edit-phone">Phone</label>
            <input id="edit-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="input" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded border-charcoal-300 text-accent-600 focus:ring-accent-500" />
            Account Active
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Delete ${deleteTarget?.name}'s account? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </>
  );
};

export default AdminCustomers;
