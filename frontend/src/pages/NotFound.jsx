import { Link } from 'react-router-dom';
import { Home, Wrench } from 'lucide-react';
import PageMeta from '../components/ui/PageMeta';

const NotFound = () => (
  <>
    <PageMeta title="Page Not Found" />
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
        <Wrench className="h-10 w-10" />
      </span>
      <h1 className="heading-xl mt-6">404</h1>
      <p className="mt-2 text-lg font-semibold">Looks like this page took a wrong turn.</p>
      <p className="mt-2 max-w-md text-charcoal-500 dark:text-charcoal-400">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <Home className="h-4 w-4" /> Back to Homepage
      </Link>
    </section>
  </>
);

export default NotFound;
