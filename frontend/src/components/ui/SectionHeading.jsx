import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className={`mx-auto max-w-2xl ${align === 'center' ? 'text-center' : 'text-left'}`}
  >
    {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
    <h2 className="heading-lg mt-2">{title}</h2>
    {description && (
      <p className="mt-4 text-charcoal-500 dark:text-charcoal-400">{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
