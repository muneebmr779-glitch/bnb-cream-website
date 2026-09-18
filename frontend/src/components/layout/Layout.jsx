import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import EmergencyButton from './EmergencyButton';

const Layout = () => (
  <div className="flex min-h-screen flex-col bg-white dark:bg-charcoal-950">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <EmergencyButton />
  </div>
);

export default Layout;
