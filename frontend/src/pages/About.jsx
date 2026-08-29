import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Users, Trophy, Target, Heart } from 'lucide-react';
import PageMeta from '../components/ui/PageMeta';
import SectionHeading from '../components/ui/SectionHeading';
import CTASection from '../components/home/CTASection';

const VALUES = [
  { icon: ShieldCheck, title: 'Integrity', description: 'Honest diagnostics and fair pricing, every single time.' },
  { icon: Wrench, title: 'Craftsmanship', description: 'Precision repairs performed by ASE-certified technicians.' },
  { icon: Users, title: 'Community', description: 'Proudly serving local drivers and families for over 15 years.' },
  { icon: Target, title: 'Reliability', description: 'On-time service you can build your schedule around.' },
];

const STATS = [
  { label: 'Years in Business', value: '15+' },
  { label: 'Vehicles Serviced', value: '20,000+' },
  { label: 'Certified Mechanics', value: '12' },
  { label: 'Average Rating', value: '4.9/5' },
];

const About = () => (
  <>
    <PageMeta
      title="About Us"
      description="Learn about AutoCare Pro — a trusted, family-owned auto repair shop with 15+ years of experience serving local drivers."
    />

    <section className="bg-charcoal-950 py-16 text-white sm:py-24">
      <div className="container-page text-center">
        <SectionHeading
          eyebrow="About AutoCare Pro"
          title="Your Neighborhood Auto Repair Experts"
          description="Since day one, we've been committed to honest, high-quality car care backed by real expertise and genuine customer service."
        />
      </div>
    </section>

    <section className="section">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">Our Story</span>
          <h2 className="heading-lg mt-4">Built on Trust, Driven by Expertise</h2>
          <p className="mt-4 text-charcoal-500 dark:text-charcoal-400">
            AutoCare Pro was founded with a simple mission: make quality car repair accessible,
            transparent, and stress-free. What started as a small family garage has grown into a
            full-service auto center trusted by thousands of drivers.
          </p>
          <p className="mt-4 text-charcoal-500 dark:text-charcoal-400">
            Every technician on our team is certified and continuously trained on the latest
            vehicle technology — from routine maintenance to complex engine diagnostics. We treat
            every car like it&apos;s our own.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-accent-600/10 p-4">
            <Heart className="h-8 w-8 shrink-0 text-accent-600" />
            <p className="text-sm text-charcoal-600 dark:text-charcoal-300">
              &quot;We don&apos;t just fix cars — we build long-term relationships with our
              customers.&quot;
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <p className="font-display text-3xl font-extrabold text-accent-600">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-charcoal-500 dark:text-charcoal-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="section bg-charcoal-50 dark:bg-charcoal-900/40">
      <div className="container-page">
        <SectionHeading eyebrow="What We Stand For" title="Our Core Values" />
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="card p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display font-bold">{value.title}</h3>
              <p className="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container-page flex flex-col items-center gap-3 text-center">
        <Trophy className="h-10 w-10 text-accent-600" />
        <h2 className="heading-lg">Award-Winning Local Service</h2>
        <p className="max-w-xl text-charcoal-500 dark:text-charcoal-400">
          Recognized for excellence in customer satisfaction and automotive craftsmanship year
          after year.
        </p>
      </div>
    </section>

    <CTASection />
  </>
);

export default About;
