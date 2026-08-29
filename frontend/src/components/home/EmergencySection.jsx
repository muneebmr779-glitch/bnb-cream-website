import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneCall, Siren } from 'lucide-react';
import { WORKSHOP_INFO } from '../../utils/constants';

const EmergencySection = () => (
  <section className="relative overflow-hidden bg-accent-600 py-16 text-white sm:py-20">
    <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20" />
    <div className="container-page relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-5"
      >
        <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
          <Siren className="h-8 w-8" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Car Trouble? We&apos;re Here to Help.
          </h2>
          <p className="mt-2 max-w-lg text-white/90">
            24/7 emergency roadside assistance and priority repair scheduling whenever you need
            us most.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <a href={`tel:${WORKSHOP_INFO.emergencyPhone}`} className="btn-secondary bg-white text-accent-600 hover:bg-charcoal-100">
          <PhoneCall className="h-4 w-4" /> Call Now
        </a>
        <Link to="/contact?emergency=true" className="btn-outline border-white text-white hover:bg-white/10 hover:text-white">
          Request Emergency Service
        </Link>
      </motion.div>
    </div>
  </section>
);

export default EmergencySection;
