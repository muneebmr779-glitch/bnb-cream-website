const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-4 font-display text-2xl font-extrabold">{value}</p>
    <p className="text-xs text-charcoal-500 dark:text-charcoal-400">{label}</p>
  </div>
);

export default StatsCard;
