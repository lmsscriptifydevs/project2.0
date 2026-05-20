import React from 'react';
import DashboardDefault from './pages/dashboard/default'; // or whatever actual admin page you want as entry
// import other admin sub-pages if needed

const AdminDashboard = () => {
  return (
    <div>
      {/* Layout, navbar, etc */}
      <DashboardDefault />
    </div>
  );
};

export default AdminDashboard;
