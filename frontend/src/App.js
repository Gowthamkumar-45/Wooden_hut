import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import CategoryPage from './Components/CategoryPage/CategoryPage';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import FurnitureMaking from './Components/FurnitureMaking/FurnitureMaking';
import Media from './Components/Media/Media';
import Reviews from './Components/Reviews/Reviews';
import Contact from './Components/Contact/Contact';
import Footer from './Components/Footer/Footer';

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

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:productSlug" element={<ProductDetail />} />
        <Route path="/furniture-making" element={<FurnitureMaking />} />
        <Route path="/media" element={<Media />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/edit-product/:productId" element={<EditProduct />} />
        <Route path="/admin/whatsapp-contacts" element={<ContactLogs />} />
        <Route path="/admin/track-orders" element={<TrackOrders />} />
        <Route path="/admin/making-videos" element={<MakingVideos />} />
        <Route path="/admin/media" element={<MediaManager />} />
        <Route path="/admin/reviews" element={<ReviewManagement />} />
      </Routes>
      {!isLoginPage && <Footer />}
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
