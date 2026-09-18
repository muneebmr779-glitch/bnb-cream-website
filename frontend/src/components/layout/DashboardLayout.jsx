import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../dashboard/DashboardSidebar';

const DashboardLayout = () => (
  <div className="section">
    <div className="container-page flex flex-col gap-8 lg:flex-row">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  </div>
);

export default DashboardLayout;
