import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Basic Service',
    price: 49,
    description: 'Oil change + inspection',
    features: ['Oil & filter change', '20-point inspection', 'Fluid top-up', 'Tire pressure check'],
    highlight: false,
  },
  {
    name: 'Standard Service',
    price: 99,
    description: 'Oil change + filters + inspection',
    features: [
      'Everything in Basic',
      'Air & cabin filter replacement',
      'Brake inspection',
      'Battery test',
      'Multi-point inspection report',
    ],
    highlight: true,
  },
  {
    name: 'Premium Service',
    price: 199,
    description: 'Complete vehicle maintenance',
    features: [
      'Everything in Standard',
      'Full fluid flush',
      'Wheel alignment check',
      'Suspension inspection',
      'Priority scheduling',
    ],
    highlight: false,
  },
];

const PricingCards = () => (
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
    {PLANS.map((plan, idx) => (
      <motion.div
        key={plan.name}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, delay: idx * 0.08 }}
        className={`relative flex flex-col rounded-2xl p-8 ${
          plan.highlight
            ? 'bg-charcoal-950 text-white shadow-glow ring-1 ring-accent-600/50 lg:-translate-y-3'
            : 'card'
        }`}
      >
        {plan.highlight && (
          <span className="badge absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-600 text-white">
            Most Popular
          </span>
        )}
        <h3 className="font-display text-xl font-bold">{plan.name}</h3>
        <p className={`mt-1 text-sm ${plan.highlight ? 'text-charcoal-300' : 'text-charcoal-500 dark:text-charcoal-400'}`}>
          {plan.description}
        </p>
        <p className="mt-6 font-display text-4xl font-extrabold">
          ${plan.price}
          <span className="text-base font-medium text-charcoal-400"> starting</span>
        </p>

        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
              <span className={plan.highlight ? 'text-charcoal-200' : 'text-charcoal-600 dark:text-charcoal-300'}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        <Link
          to="/booking"
          className={`mt-8 w-full justify-center ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
        >
          Book Now
        </Link>
      </motion.div>
    ))}
  </div>
);

export default PricingCards;
