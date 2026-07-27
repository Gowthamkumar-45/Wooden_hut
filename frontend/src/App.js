import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import CategoryPage from './Components/CategoryPage/CategoryPage';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import FurnitureMaking from './Components/FurnitureMaking/FurnitureMaking';
import Media from './Components/Media/Media';
import Reviews from './Components/Reviews/Reviews';
import Contact from './Components/Contact/Contact';
import SearchResults from './Components/SearchResults/SearchResults';
import Footer from './Components/Footer/Footer';
import FloatingContact from './Components/FloatingContact/FloatingContact';

import About from './Components/About/About';
import Login from './Components/Login/Login';
import AddProduct from './Components/Admin/AddProducts/AddProduct';
import ProductList from './Components/Admin/ProductList/ProductList';
import EditProduct from './Components/Admin/EditProduct/EditProduct';
import ContactLogs from './Components/Admin/ContactLogs/ContactLogs';
import TrackOrders from './Components/Admin/TrackOrders/TrackOrders';
import MakingVideos from './Components/Admin/MakingVideos/MakingVideos';
import MediaManager from './Components/Admin/MediaManager/MediaManager';
import ReviewManagement from './Components/Admin/ReviewManagement/ReviewManagement';
import CategoryManager from './Components/Admin/CategoryManager/CategoryManager';
import UserManager from './Components/Admin/UserManager/UserManager';

import Dashboard from './Components/Admin/Dashboard/Dashboard';
import AdminLayout from './Components/Admin/Layout/AdminLayout';
import Loader from './Components/Loader/Loader';

// Helper to check if the network/internet connection is slow
const isConnectionSlow = () => {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return false; // Assume fast connection by default if API is unsupported
  
  const isSlowType = ['slow-2g', '2g', '3g'].includes(conn.effectiveType);
  const isLowDownlink = typeof conn.downlink === 'number' && conn.downlink < 2.0; // Less than 2 Mbps
  const isHighRtt = typeof conn.rtt === 'number' && conn.rtt > 150; // Latency more than 150ms
  
  return isSlowType || isLowDownlink || isHighRtt;
};

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isAdmin, setIsAdmin] = useState(!!sessionStorage.getItem('token'));
  const [pageLoading, setPageLoading] = useState(isConnectionSlow());
  const isInitialLoad = useRef(true);
  
  // Check if we are in "Preview Mode"
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true' || localStorage.getItem('admin_preview') === 'true';

  // Update isAdmin state when location changes (to catch login/logout)
  useEffect(() => {
    setIsAdmin(!!sessionStorage.getItem('token'));
  }, [location]);

  // Handle page transitions with loader
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    // Only trigger transition loader for non-admin pages if network is slow
    if (!location.pathname.startsWith('/admin') && isConnectionSlow()) {
      setPageLoading(true);
      window.scrollTo(0, 0);
    } else {
      // Still scroll to top on fast connection route changes
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Wake up Render free-tier backend immediately on app load
  useEffect(() => {
    const API_BASE = window.location.hostname === 'localhost'
      ? 'http://localhost:8000'
      : 'https://api.woodenhut.in';
    fetch(API_BASE, { method: 'HEAD' }).catch(() => {});
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {pageLoading && <Loader onComplete={() => setPageLoading(false)} />}
      {!isLoginPage && !isAdminRoute && <Header />}
      <Routes>
        {/* If Admin is logged in AND NOT in preview mode, redirect to Admin area */}
        <Route path="/" element={isAdmin && !isPreview ? <Navigate to="/admin/dashboard" /> : <Home />} />
        
        <Route path="/about" element={<About />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:productSlug" element={<ProductDetail />} />
        <Route path="/furniture-making" element={<FurnitureMaking />} />
        <Route path="/media" element={<Media />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes wrapped in AdminLayout with Auth Protection */}
        <Route path="/admin/*" element={
          isAdmin ? (
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="add-products" element={<AddProduct />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="products" element={<ProductList />} />
                <Route path="edit-product/:productId" element={<EditProduct />} />
                <Route path="whatsapp-contacts" element={<ContactLogs />} />
                <Route path="track-orders" element={<TrackOrders />} />
                <Route path="making-videos" element={<MakingVideos />} />
                <Route path="media" element={<MediaManager />} />
                <Route path="reviews" element={<ReviewManagement />} />
                <Route path="users" element={<UserManager />} />
                <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
                <Route path="help" element={<div>Help Center (Coming Soon)</div>} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
      {!isLoginPage && !isAdminRoute && <Footer />}
      {!isLoginPage && !isAdminRoute && <FloatingContact />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
