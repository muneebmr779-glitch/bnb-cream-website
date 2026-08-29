import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Clock, Star, Wrench } from 'lucide-react';

const Hero = () => (
  <section className="relative overflow-hidden bg-charcoal-950 text-white">
    <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-40" />
    <div className="absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-accent-600/20 blur-[120px]" />
    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-600/10 blur-[100px]" />

    <div className="container-page relative grid grid-cols-1 items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="eyebrow bg-white/10 text-accent-400 ring-white/10">
          <ShieldCheck className="h-3.5 w-3.5" /> Certified &amp; Trusted Auto Experts
        </span>
        <h1 className="heading-xl mt-6">
          Professional Car Repair &amp;{' '}
          <span className="text-accent-500">Auto Care</span> You Can Trust
        </h1>
        <p className="mt-6 max-w-xl text-lg text-charcoal-300">
          Expert automotive service, transparent pricing, and reliable repairs to keep your
          vehicle safe and running smoothly.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/booking" className="btn-primary text-base">
            Book a Service <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/services" className="btn-outline border-white/20 text-white hover:border-accent-500 hover:text-accent-400 text-base">
            Explore Services
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          <div>
            <p className="font-display text-2xl font-extrabold sm:text-3xl">15+</p>
            <p className="text-xs text-charcoal-400 sm:text-sm">Years Experience</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold sm:text-3xl">20k+</p>
            <p className="text-xs text-charcoal-400 sm:text-sm">Cars Serviced</p>
          </div>
          <div>
            <p className="font-display flex items-center gap-1 text-2xl font-extrabold sm:text-3xl">
              4.9 <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </p>
            <p className="text-xs text-charcoal-400 sm:text-sm">Customer Rating</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative"
      >
        <div className="glass relative mx-auto aspect-square w-full max-w-md rounded-[2.5rem] p-8 sm:p-10">
          <div className="animate-float flex h-full flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-accent-600 shadow-glow">
              <Wrench className="h-12 w-12 text-white" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">Full-Service Garage</p>
              <p className="mt-2 text-sm text-charcoal-300">
                From oil changes to full engine rebuilds — one trusted workshop.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
              <Clock className="h-3.5 w-3.5 text-accent-400" /> Same-day service available
            </div>
          </div>
        </div>
        <div className="card absolute -bottom-6 -left-6 hidden w-48 p-4 sm:block">
          <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">Next Available Slot</p>
          <p className="mt-1 font-display text-lg font-bold text-charcoal-900 dark:text-white">Today, 2:00 PM</p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
