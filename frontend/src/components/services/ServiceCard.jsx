import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { getServiceIcon } from '../../utils/iconMap';

const ServiceCard = ({ service, index = 0 }) => {
  const Icon = getServiceIcon(service.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-charcoal-900 to-charcoal-800">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-14 w-14 text-accent-500/80" />
          </div>
        )}
        {service.isPopular && (
          <span className="badge absolute left-3 top-3 bg-accent-600 text-white">Popular</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
          <Icon className="h-4 w-4" /> {service.category}
        </div>
        <h3 className="mt-2 font-display text-lg font-bold">{service.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-charcoal-500 dark:text-charcoal-400">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-charcoal-100 pt-4 dark:border-charcoal-800">
          <div>
            <p className="text-xs text-charcoal-400">Starting at</p>
            <p className="font-display text-xl font-extrabold text-charcoal-900 dark:text-white">
              ${service.price}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-charcoal-500 dark:text-charcoal-400">
            <Clock className="h-3.5 w-3.5" /> {service.duration}
          </div>
        </div>

        <Link
          to={`/booking?service=${service._id}`}
          className="btn-primary mt-4 w-full justify-center"
        >
          Book Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
