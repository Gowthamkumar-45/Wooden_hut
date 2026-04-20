import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  Settings, 
  HelpCircle,
  Video,
  Image,
  ChevronLeft,
  Plus,
  User
} from 'lucide-react';
import './AdminSidebar.css';
import { SITE_CONTENT } from '../../../constants/content';

const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <div className="logo-icon">X</div>
          <span>{SITE_CONTENT.brand.name}</span>
        </Link>
        <button className="collapse-btn" onClick={toggleSidebar}>
          <ChevronLeft size={16} style={{ transition: 'transform 0.3s ease', transform: isCollapsed ? 'rotate(180deg)' : 'none' }} />
        </button>
      </div>


      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="group-label">Main Menu</span>
          
          <NavLink to="/admin/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/add-products" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Plus size={20} />
            <span>Add Products</span>
          </NavLink>

          <NavLink to="/admin/products" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            <span>Products List</span>
          </NavLink>

          <NavLink to="/admin/track-orders" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            <span>Track Orders</span>
          </NavLink>

          <NavLink to="/admin/whatsapp-contacts" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Customer Logs</span>
          </NavLink>

          <NavLink to="/admin/reviews" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Star size={20} />
            <span>Reviews</span>
          </NavLink>

          <NavLink to="/admin/making-videos" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Video size={20} />
            <span>Making Video</span>
          </NavLink>

          <NavLink to="/admin/media" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Image size={20} />
            <span>Media</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-sidebar">
          <div className="user-avatar-colorful">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Marutham Admin</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
        
        <NavLink to="/admin/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

      </div>
    </aside>
  );
};

export default AdminSidebar;
