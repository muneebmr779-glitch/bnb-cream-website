import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck } from 'lucide-react';

const CTASection = () => (
  <section className="section">
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-charcoal-950 px-8 py-16 text-center text-white sm:px-16"
      >
        <div className="absolute inset-0 bg-grid-pattern bg-[size:36px_36px] opacity-30" />
        <div className="relative">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-600 shadow-glow mx-auto">
            <CalendarCheck className="h-8 w-8" />
          </span>
          <h2 className="heading-lg mt-6">Ready to Get Your Car Serviced?</h2>
          <p className="mx-auto mt-4 max-w-xl text-charcoal-300">
            Book online in under two minutes. Choose your service, pick a time, and we&apos;ll
            take care of the rest.
          </p>
          <Link to="/booking" className="btn-primary mt-8 text-base">
            Book a Service <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
