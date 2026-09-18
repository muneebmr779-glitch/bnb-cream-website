import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../services/ServiceCard';
import Loader from '../ui/Loader';
import { getServices } from '../../services/serviceService';

const QuickServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices({ popular: 'true' })
      .then((res) => setServices(res.services.slice(0, 8)))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section bg-charcoal-50 dark:bg-charcoal-900/40">
      <div className="container-page">
        <SectionHeading
          eyebrow="What We Offer"
          title="Popular Services"
          description="From routine maintenance to major repairs, our certified technicians handle it all with precision and care."
        />

        {loading ? (
          <Loader label="Loading services..." />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <ServiceCard key={service._id} service={service} index={idx} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/services" className="btn-outline">
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickServices;
