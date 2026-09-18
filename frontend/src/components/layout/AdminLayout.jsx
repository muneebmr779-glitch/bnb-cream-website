import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => (
  <div className="section">
    <div className="container-page flex flex-col gap-8 lg:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
