import { useState } from 'react';
import { PhoneCall, X, Siren } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WORKSHOP_INFO } from '../../utils/constants';

const EmergencyButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="card mb-3 w-64 p-4"
          >
            <p className="text-sm font-semibold">Car trouble right now?</p>
            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
              Call our emergency line or request roadside help.
            </p>
            <a href={`tel:${WORKSHOP_INFO.emergencyPhone}`} className="btn-primary mt-3 w-full">
              <PhoneCall className="h-4 w-4" /> Call Now
            </a>
            <Link to="/contact?emergency=true" className="btn-outline mt-2 w-full" onClick={() => setOpen(false)}>
              Request Emergency Service
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-600 text-white shadow-glow transition hover:bg-accent-500 active:scale-95"
        aria-label="Emergency service"
      >
        {open ? <X className="h-6 w-6" /> : <Siren className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default EmergencyButton;
