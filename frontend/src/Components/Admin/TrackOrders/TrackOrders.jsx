import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Phone,
  Eye,
  X,
  ShoppingCart,
  CheckCircle,
  XSquare,
  Database,
  Calendar,
  Package,
  Info,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './TrackOrders.css';

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('confirmed');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const headers = { 'Authorization': `Token ${token}` };
      const [waRes, enqRes] = await Promise.all([
        fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/`, { headers }),
        fetch(`${SITE_CONTENT.api.base}/api/enquiries/`, { headers })
      ]);
      if (waRes.ok && enqRes.ok) {
        const waData = await waRes.json();
        const enqData = await enqRes.json();
        const isConfirmedEntry = (i) => i.is_order_confirmed || i.status === 'Confirmed' || i.status === 'Rejected';
        const combined = [
          ...waData.filter(isConfirmedEntry).map(i => ({ ...i, _source: 'whatsapp' })),
          ...enqData.filter(isConfirmedEntry).map(i => ({ ...i, _source: 'enquiries' }))
        ];
        setOrders(combined.sort((a, b) => new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at)));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpdate = async (status, progress) => {
    const endpoint = selectedOrder._source === 'whatsapp' ? 'whatsapp-contacts' : 'enquiries';
    const payload = { status, order_status: progress, is_order_confirmed: status !== 'Pending' };

    try {
      const res = await fetch(`${SITE_CONTENT.api.base}/api/${endpoint}/${selectedOrder.id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Token ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (status === 'Pending') {
          setOrders(prev => prev.filter(o => !(o.id === selectedOrder.id && o._source === selectedOrder._source)));
        } else {
          setOrders(prev => prev.map(o => (o.id === selectedOrder.id && o._source === selectedOrder._source) ? { ...o, ...payload } : o));
        }
        closeModal();
      }
    } catch (err) { }
  };

  const handleDelete = async (source, id) => {
    if (!window.confirm('Remove from Tracker?')) return;
    try {
      const res = await fetch(`${SITE_CONTENT.api.base}/api/${source === 'whatsapp' ? 'whatsapp-contacts' : 'enquiries'}/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Token ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_order_confirmed: false, status: 'Pending' })
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => !(o.id === id && o._source === source)));
      }
    } catch (err) { }
  };

  const closeModal = () => { setSelectedOrder(null); setModalType(null); };

  const getFilteredOrders = () => {
    let data = [];
    if (activeTab === 'confirmed') data = orders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled' && o.status !== 'Rejected');
    else if (activeTab === 'cancelled') data = orders.filter(o => o.order_status === 'Cancelled' || o.status === 'Rejected');
    else data = orders.filter(o => o.order_status === 'Delivered');

    return data.filter(o =>
      (o.customer_name || o.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.id.toString()).includes(searchQuery)
    );
  };

  const getPaginatedOrders = () => {
    const filtered = getFilteredOrders();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const totalPages = Math.ceil(getFilteredOrders().length / ITEMS_PER_PAGE);

  const getStatusBadge = (status) => {
    const s = status || 'Not Started';
    const display = s === 'Processing' ? 'In Production' : s;
    const cls = `status-pill ${s.toLowerCase().replace(' ', '-')}`;
    return <span className={cls}>{display}</span>;
  };

  if (loading) return <div className="admin-loading"><p>Syncing production queue...</p></div>;

  return (
    <div className="track-orders-container">
      <div className="track-header">
        <button className="refresh-btn-main" onClick={fetchOrders} title="Refresh Tracker">
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>
      <div className="track-tabs-row">
        <div className="tabs-group">
          <button className={`track-tab ${activeTab === 'confirmed' ? 'active' : ''}`} onClick={() => { setActiveTab('confirmed'); setCurrentPage(1); }}><ShoppingCart size={18} /> Confirmed Orders</button>
          <button className={`track-tab ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => { setActiveTab('cancelled'); setCurrentPage(1); }}><XSquare size={18} /> Cancelled Orders</button>
          <button className={`track-tab ${activeTab === 'delivered' ? 'active' : ''}`} onClick={() => { setActiveTab('delivered'); setCurrentPage(1); }}><CheckCircle size={18} /> Delivered Orders</button>
        </div>
      </div>
      {activeTab === 'confirmed' && (<div className="active-count-pill">Active Orders: {getFilteredOrders().length}</div>)}
      {activeTab === 'delivered' && (<div className="active-count-pill" style={{ color: 'var(--admin-success)', borderColor: 'var(--admin-success)', background: '#ecfdf5' }}>Total Delivered: {getFilteredOrders().length}</div>)}
      {activeTab === 'cancelled' && (<div className="active-count-pill" style={{ color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)', background: '#fef2f2' }}>Total Cancelled: {getFilteredOrders().length}</div>)}

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr><th>CUSTOMER DETAILS</th><th>ORDER CONFIRMATION</th><th>CURRENT STATUS</th><th>REQUIREMENT</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {getPaginatedOrders().length > 0 ? (
              getPaginatedOrders().map((order) => (
                <tr key={`${order._source}-${order.id}`} onClick={() => setSelectedOrder(order) || setModalType('status')}>
                  <td><div className="cust-info"><span className="name">{order.customer_name || order.name}</span><span className="phone"><Phone size={10} /> {order.phone_number || order.phone}</span></div></td>
                  <td>
                    <div className="order-meta">
                      <span className={`status-text-small ${(order.order_status === 'Cancelled' || order.status === 'Rejected') ? 'cancelled' : 'confirmed'}`}>
                        {(order.order_status === 'Cancelled' || order.status === 'Rejected') ? 'Cancelled' : 'Order Confirmed'}
                      </span>
                    </div>
                  </td>
                  <td>{getStatusBadge(order.order_status)}</td>
                  <td><span className="req-text">{order.product_name || order.service}</span></td>
                  <td>
                    <div className="action-btns" onClick={e => e.stopPropagation()}>
                      <button className="icon-btn" title="View Details" onClick={() => setSelectedOrder(order) || setModalType('view')}><Eye size={16} /></button>
                      <button className="icon-btn delete" title="Remove" onClick={() => handleDelete(order._source, order.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5"><div className="no-data"><Database size={48} strokeWidth={1} /><p>No data</p></div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="pag-btn">
            <ChevronLeft size={18} />
          </button>
          <div className="pag-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} className={`pag-num ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="pag-btn">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {modalType === 'status' && selectedOrder && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-status-modal" onClick={e => e.stopPropagation()}>
            <div className="status-modal-header"><h3>Update Order Status</h3><button className="close-icon-btn" onClick={closeModal}><X size={18} /></button></div>
            <div className="status-modal-body">
              <div className="status-form-field"><label>Order Decision?</label><div className="select-box-custom">
                <select id="tracker-status-input" defaultValue={selectedOrder.status}>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending (Back to Logs)</option>
                  <option value="Rejected">Cancelled</option>
                </select></div></div>
              <div className="status-form-field" style={{ marginTop: '20px' }}><label>Progress?</label><div className="select-box-custom">
                <select id="tracker-progress-input" defaultValue={selectedOrder.order_status || 'Not Started'}>
                  <option value="Not Started">Not Started</option>
                  <option value="Processing">In Production</option>
                  <option value="Delivered">Order Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select></div></div>
            </div>
            <div className="status-modal-footer">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="apply-btn" onClick={() => {
                const status = document.getElementById('tracker-status-input').value;
                const progress = document.getElementById('tracker-progress-input').value;
                handleUpdate(status, progress);
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'view' && selectedOrder && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content view-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Order Details Card</h2><button className="close-x" onClick={closeModal}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="detail-section"><div className="detail-main-info">
                <h3>{selectedOrder.customer_name || selectedOrder.name}</h3>
                <div style={{ marginTop: '8px' }}>{getStatusBadge(selectedOrder.order_status)}</div>
              </div></div>
              <div className="details-grid">
                <div className="detail-item"><label><Phone size={12} /> Phone</label><span>{selectedOrder.phone_number || selectedOrder.phone || 'N/A'}</span></div>
                <div className="detail-item"><label><Package size={12} /> Interested In</label><span>{selectedOrder.product_name || selectedOrder.service || 'N/A'}</span></div>
                <div className="detail-item full-width"><label><Calendar size={12} /> Order ID & Date</label><span>#{selectedOrder._source.substring(0, 2).toUpperCase()}-{selectedOrder.id} • {new Date(selectedOrder.timestamp || selectedOrder.created_at).toLocaleString()}</span></div>
              </div>

              <div className="message-full">
                <label><Info size={12} /> Inquiry Message</label>
                <p>{selectedOrder.message || selectedOrder.subject || 'No specific message provided for this order.'}</p>
              </div>
            </div>
            <div className="modal-footer"><button className="admin-btn secondary" onClick={closeModal}>Close Details</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrders;
