const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-200 py-16 text-center dark:border-charcoal-700">
    {Icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-100 dark:bg-charcoal-800">
        <Icon className="h-7 w-7 text-charcoal-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold">{title}</h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-charcoal-500 dark:text-charcoal-400">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
