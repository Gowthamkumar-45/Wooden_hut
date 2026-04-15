import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = (pathname) => {
    if (pathname.includes('/admin/dashboard')) return 'Dashboard';
    if (pathname.includes('/admin/products')) return 'Product Inventory';
    if (pathname.includes('/admin/add-products')) return 'Add New Product';
    if (pathname.includes('/admin/track-orders')) return 'Order Tracking';
    if (pathname.includes('/admin/whatsapp-contacts')) return 'Customer Logs';
    if (pathname.includes('/admin/reviews')) return 'Review Moderation';
    if (pathname.includes('/admin/settings')) return 'Settings';
    return 'Dashboard';
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/';
  };

  const handlePreview = () => {
    navigate('/?preview=true');
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h2>{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="preview-btn" onClick={handlePreview} title="Preview Live Store">
            <ExternalLink size={20} />
            <span>Preview Store</span>
          </button>
          
          <button className="logout-btn" onClick={handleLogout} title="Logout Session">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
