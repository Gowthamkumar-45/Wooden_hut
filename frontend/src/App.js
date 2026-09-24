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
import PrivacyPolicy from './Components/Legal/PrivacyPolicy';
import TermsConditions from './Components/Legal/TermsConditions';
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

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isAdmin, setIsAdmin] = useState(!!sessionStorage.getItem('token'));
  const isInitialLoad = useRef(true);
  
  // Check if we are in "Preview Mode"
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true' || localStorage.getItem('admin_preview') === 'true';

  // Update isAdmin state when location changes (to catch login/logout)
  useEffect(() => {
    setIsAdmin(!!sessionStorage.getItem('token'));
  }, [location]);

  // Scroll to top on route change (not on the very first mount, where the
  // browser's own scroll restoration should win).
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Wake up Render free-tier backend immediately on app load
  useEffect(() => {
    const API_BASE = window.location.hostname === 'localhost'
      ? 'http://localhost:8000'
      : 'https://api.woodenhut.in';
    fetch(API_BASE, { method: 'HEAD' }).catch(() => {});
  }, []);

  // Log one visit per app load, for the admin dashboard's "Total Visitors"
  // card. Runs once on mount (not on every client-side route change, since
  // that's still the same visit) and skips anything admin-related, so
  // staff never inflate the visitor count:
  //  - /admin/* — the panel itself
  //  - /login — nobody but staff ever needs this page
  //  - isAdmin — an already-authenticated session (e.g. browsing the
  //    public site in the same tab while still logged in)
  //  - isPreview — admin previewing the storefront
  useEffect(() => {
    if (isAdmin || isPreview || location.pathname.startsWith('/admin') || location.pathname === '/login') return;
    const API_BASE = window.location.hostname === 'localhost'
      ? 'http://localhost:8000'
      : 'https://api.woodenhut.in';
    fetch(`${API_BASE}/api/track-visit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname })
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
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
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
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
