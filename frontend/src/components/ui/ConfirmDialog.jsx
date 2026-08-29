import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
    <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
        Cancel
      </button>
      <button
        type="button"
        className={danger ? 'btn-primary' : 'btn-secondary'}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Please wait...' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
