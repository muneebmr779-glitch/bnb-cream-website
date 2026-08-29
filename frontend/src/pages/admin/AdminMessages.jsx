import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Trash2, Siren } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getContactMessages, markMessageRead, deleteContactMessage } from '../../services/contactService';
import { getErrorMessage } from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getContactMessages()
      .then((res) => setMessages(res.messages))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleMarkRead = async (message) => {
    if (message.isRead) return;
    try {
      await markMessageRead(message._id);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteContactMessage(deleteTarget._id);
      toast.success('Message deleted');
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
      <PageMeta title="Contact Messages" />
      <h1 className="font-display text-2xl font-bold">Contact Messages</h1>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading messages..." />
        ) : messages.length === 0 ? (
          <EmptyState icon={Mail} title="No messages yet" description="Customer inquiries will appear here." />
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                onClick={() => handleMarkRead(message)}
                className={`card cursor-pointer p-5 transition ${!message.isRead ? 'ring-2 ring-accent-500/40' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{message.subject}</p>
                      {message.isEmergency && (
                        <span className="badge bg-accent-600 text-white"><Siren className="h-3 w-3" /> Emergency</span>
                      )}
                      {!message.isRead && <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">New</span>}
                    </div>
                    <p className="mt-1 text-xs text-charcoal-400">
                      {message.name} &middot; {message.email} {message.phone && `· ${message.phone}`}
                    </p>
                  </div>
                  <p className="text-xs text-charcoal-400">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-3 text-sm text-charcoal-600 dark:text-charcoal-300">{message.message}</p>
                <div className="mt-4 flex justify-end border-t border-charcoal-100 pt-4 dark:border-charcoal-800">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(message);
                    }}
                    className="btn-ghost px-4 py-2 text-xs text-accent-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to permanently delete this message?"
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </>
  );
};

export default AdminMessages;
