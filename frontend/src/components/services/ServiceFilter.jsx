import { Search } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../utils/constants';

const ServiceFilter = ({ search, onSearchChange, category, onCategoryChange }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search services..."
        className="input pl-10"
      />
    </div>

    <div className="flex flex-wrap gap-2">
      {SERVICE_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => onCategoryChange(cat.value)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            category === cat.value
              ? 'bg-accent-600 text-white'
              : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200 dark:bg-charcoal-800 dark:text-charcoal-300 dark:hover:bg-charcoal-700'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  </div>
);

export default ServiceFilter;
