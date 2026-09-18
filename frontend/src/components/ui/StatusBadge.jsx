import { STATUS_STYLES } from '../../utils/constants';

const StatusBadge = ({ status }) => (
  <span className={`badge capitalize ${STATUS_STYLES[status] || 'bg-charcoal-100 text-charcoal-700'}`}>
    {status?.replace('-', ' ')}
  </span>
);

export default StatusBadge;
