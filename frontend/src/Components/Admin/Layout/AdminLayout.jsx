import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Separate from isSidebarCollapsed (that's the desktop 260px<->80px
  // icon-rail toggle) — below the mobile breakpoint the sidebar is an
  // off-canvas drawer instead, hidden by default and slid in over the
  // content rather than squeezing it.
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((open) => !open);
  };

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className={`admin-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileSidebarOpen}
        onNavigate={closeMobileSidebar}
      />
      {isMobileSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={closeMobileSidebar} />
      )}
      <div className="admin-main">
        <AdminHeader onMenuClick={toggleMobileSidebar} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
