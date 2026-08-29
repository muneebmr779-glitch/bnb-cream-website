import { Link, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import PageMeta from '../components/ui/PageMeta';
import SectionHeading from '../components/ui/SectionHeading';
import BookingForm from '../components/booking/BookingForm';
import useAuth from '../hooks/useAuth';

const Booking = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  return (
    <>
      <PageMeta
        title="Book a Service"
        description="Book your car repair or maintenance appointment online in minutes. Choose your service, pick a date and time, and get instant confirmation."
      />
      <section className="bg-charcoal-950 py-16 text-white sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            eyebrow="Book Online"
            title="Schedule Your Service Appointment"
            description="Tell us about your vehicle and pick a time that works for you. We'll confirm your booking right away."
          />
        </div>
      </section>

      <section className="section">
        <div className="container-page mx-auto max-w-2xl">
          {loading ? null : isAuthenticated ? (
            <BookingForm />
          ) : (
            <div className="card p-8 text-center">
              <LogIn className="mx-auto h-12 w-12 text-accent-600" />
              <h3 className="mt-4 font-display text-xl font-bold">Login to Book a Service</h3>
              <p className="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">
                Create a free account or log in to book an appointment and manage your service
                history.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/login" state={{ from: location }} className="btn-primary">
                  Login
                </Link>
                <Link to="/register" state={{ from: location }} className="btn-outline">
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Booking;
