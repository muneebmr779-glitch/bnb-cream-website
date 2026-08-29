import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import PageMeta from '../components/ui/PageMeta';
import SectionHeading from '../components/ui/SectionHeading';
import ServiceFilter from '../components/services/ServiceFilter';
import ServiceCard from '../components/services/ServiceCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { getServices } from '../services/serviceService';
import { getErrorMessage } from '../services/api';

const useDebounce = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Services = () => {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setLoading(true);
    getServices({ search: debouncedSearch, category })
      .then((res) => setServices(res.services))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category]);

  return (
    <>
      <PageMeta
        title="Our Services"
        description="Browse our full catalog of car repair and maintenance services including brake repair, engine diagnostics, oil changes, tire service and more."
      />
      <section className="bg-charcoal-950 py-16 text-white sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            eyebrow="Full Service Catalog"
            title="Car Repair & Maintenance Services"
            description="Search and filter our complete range of automotive services to find exactly what your vehicle needs."
          />
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <ServiceFilter
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
          />

          <div className="mt-10">
            {loading ? (
              <Loader label="Loading services..." />
            ) : error ? (
              <EmptyState icon={Wrench} title="Couldn't load services" description={error} />
            ) : services.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title="No services found"
                description="Try adjusting your search or filter to find what you're looking for."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service, idx) => (
                  <ServiceCard key={service._id} service={service} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
