import { Loader2 } from 'lucide-react';

const Loader = ({ full = false, label = 'Loading...' }) => (
  <div
    className={
      full
        ? 'flex min-h-[60vh] w-full flex-col items-center justify-center gap-3'
        : 'flex w-full flex-col items-center justify-center gap-3 py-12'
    }
  >
    <Loader2 className="h-8 w-8 animate-spin text-accent-600" />
    <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{label}</p>
  </div>
);

export default Loader;
