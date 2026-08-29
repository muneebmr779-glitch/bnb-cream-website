import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Timer, BadgeDollarSign, Users, Award } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Certified Technicians',
    description: 'ASE-certified mechanics with years of hands-on experience across all makes and models.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Transparent Pricing',
    description: 'No hidden fees. You approve every quote before we start any work on your vehicle.',
  },
  {
    icon: Timer,
    title: 'Fast Turnaround',
    description: 'Most services completed same-day so you can get back on the road quickly.',
  },
  {
    icon: Wrench,
    title: 'Genuine Parts',
    description: 'We use quality OEM and premium aftermarket parts backed by warranty.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Friendly service, clear communication, and support at every step of your visit.',
  },
  {
    icon: Award,
    title: 'Satisfaction Guaranteed',
    description: 'We stand behind every repair with a workmanship guarantee on all services.',
  },
];

const WhyChooseUs = () => (
  <section className="section">
    <div className="container-page">
      <SectionHeading
        eyebrow="Why Choose Us"
        title="Auto Care Built On Trust"
        description="We combine technical expertise with honest service so you always know exactly what your car needs."
      />

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((reason, idx) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="group rounded-2xl p-2 transition hover:bg-charcoal-50 dark:hover:bg-charcoal-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 transition group-hover:bg-accent-600 group-hover:text-white dark:text-accent-400">
              <reason.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{reason.title}</h3>
            <p className="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">{reason.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
