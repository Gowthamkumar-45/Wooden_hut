import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Phone, 
  Calendar, 
  Eye, 
  Edit, 
  X, 
  Mail,
  ArrowUpRight,
  Package,
  Info,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './ContactLogs.css';

const ContactLogs = () => {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [whatsappContacts, setWhatsappContacts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const headers = { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' };
      const [waRes, enqRes] = await Promise.all([
        fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/`, { headers }),
        fetch(`${SITE_CONTENT.api.base}/api/enquiries/`, { headers })
      ]);
      if (waRes.ok && enqRes.ok) {
        const waData = await waRes.json();
        const enqData = await enqRes.json();
        setWhatsappContacts(waData.map(i => ({...i, _source: 'whatsapp'})));
        setEnquiries(enqData.map(i => ({...i, _source: 'enquiries'})));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (source, id, newStatus) => {
    const endpoint = source === 'whatsapp' ? 'whatsapp-contacts' : 'enquiries';
    
    let updatePayload = { status: newStatus };
    if (newStatus === 'Confirmed') {
      updatePayload.is_order_confirmed = true;
      updatePayload.order_status = 'Not Started';
    } else if (newStatus === 'Rejected') {
      updatePayload.is_order_confirmed = true;
      updatePayload.order_status = 'Cancelled';
    } else {
      updatePayload.is_order_confirmed = false;
    }

    try {
      const res = await fetch(`${SITE_CONTENT.api.base}/api/${endpoint}/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Token ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) {
        if (source === 'whatsapp') {
          setWhatsappContacts(prev => prev.map(i => i.id === id ? { ...i, ...updatePayload } : i));
        } else {
          setEnquiries(prev => prev.map(i => i.id === id ? { ...i, ...updatePayload } : i));
        }
        closeModal();
      }
    } catch (err) { console.error("Status Update Failed:", err); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const source = selectedItem._source;
    const updatedData = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await fetch(`${SITE_CONTENT.api.base}/api/${source === 'whatsapp' ? 'whatsapp-contacts' : 'enquiries'}/${selectedItem.id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Token ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updateFn = (prev) => prev.map(i => i.id === selectedItem.id ? { ...i, ...updatedData } : i);
        if (source === 'whatsapp') setWhatsappContacts(updateFn); else setEnquiries(updateFn);
        closeModal();
      }
    } catch (err) {}
  };

  const handleDelete = async (source, id) => {
    if (!window.confirm('Delete this log?')) return;
    try {
      const res = await fetch(`${SITE_CONTENT.api.base}/api/${source === 'whatsapp' ? 'whatsapp-contacts' : 'enquiries'}/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${sessionStorage.getItem('token')}` }
      });
      if (res.ok) {
        if (source === 'whatsapp') setWhatsappContacts(p => p.filter(i => i.id !== id));
        else setEnquiries(p => p.filter(i => i.id !== id));
      }
    } catch (err) {}
  };

  const closeModal = () => { setSelectedItem(null); setModalType(null); };

  const filteredData = () => {
    let data = [];
    if (activeTab === 'whatsapp') {
      data = whatsappContacts.filter(i => i.status === 'New' || !i.status);
    } else if (activeTab === 'enquiries') {
      data = enquiries.filter(i => i.status === 'New' || !i.status);
    } else if (activeTab === 'pending orders') {
      data = [...whatsappContacts, ...enquiries].filter(i => i.status === 'Pending');
    }

    return data.filter(i => {
      const search = searchQuery.toLowerCase();
      const matchSearch = (i.customer_name || i.name || '').toLowerCase().includes(search) || (i.phone_number || i.phone || '').includes(search);
      const matchStatus = statusFilter === 'all' || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
  };

  const getPaginatedData = () => {
    const data = filteredData();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const totalPages = Math.ceil(filteredData().length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  const getStatusIcon = (status) => {
    const cls = `status-indicator ${status?.toLowerCase() || 'new'}`;
    return <span className={cls}>{status || 'New'}</span>;
  };

  if (loading) return <div className="admin-loading"><p>Syncing contact logs...</p></div>;

  return (
    <div className="contact-logs-container">
      <div className="track-header">
        <button className="refresh-btn-main" onClick={fetchData} title="Refresh Logs">
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="track-tabs-row">
        <div className="tabs-group">
          <button className={`track-tab ${activeTab==='whatsapp'?'active':''}`} onClick={()=>setActiveTab('whatsapp')}><MessageSquare size={18}/> WhatsApp Contacts</button>
          <button className={`track-tab ${activeTab==='enquiries'?'active':''}`} onClick={()=>setActiveTab('enquiries')}><Mail size={18}/> Web Enquiries</button>
          <button className={`track-tab ${activeTab==='pending orders'?'active':''}`} onClick={()=>setActiveTab('pending orders')}><Package size={18}/> Pending Inquiry</button>
        </div>
      </div>

      <div className="active-count-pill" style={{marginBottom: '24px'}}>
        {activeTab === 'whatsapp' ? 'New Leads: ' : activeTab === 'enquiries' ? 'New Enquiries: ' : 'Total Pending: '}
        {filteredData().length}
      </div>

      <div className="table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>CUSTOMER NAME</th>
              <th>PHONE NUMBER</th>
              <th>INTERESTED IN</th>
              <th>CONTACTED ON</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().length > 0 ? (
              getPaginatedData().map(item => (
                <tr key={`${item._source}-${item.id}`} onClick={(e)=>{ if(!e.target.closest('.action-btns')) { setSelectedItem(item); setModalType('status'); }}}>
                  <td>
                     <div className="info-text">
                       <span className="name">{item.customer_name || item.name || 'Guest'}</span>
                       <span className="subtext">({item._source === 'whatsapp' ? 'WhatsApp' : 'Web'})</span>
                     </div>
                  </td>
                  <td>
                    <span className="phone-badge">{item.phone_number || item.phone || 'N/A'}</span>
                  </td>
                  <td>
                    <strong style={{fontSize: '13px', color: '#1e293b'}}>{item.product_name || item.service || 'N/A'}</strong>
                  </td>
                  <td>
                     <div className="date-badge">
                       {new Date(item.timestamp || item.created_at).toLocaleDateString()}
                     </div>
                  </td>
                  <td>{getStatusIcon(item.status)}</td>
                  <td>
                    <div className="action-btns" onClick={e=>e.stopPropagation()}>
                      <button className="icon-btn" title="View" onClick={()=>setSelectedItem(item)||setModalType('view')}><Eye size={16}/></button>
                      <button className="icon-btn edit" title="Edit" onClick={()=>setSelectedItem(item)||setModalType('edit')}><Edit size={16}/></button>
                      <button className="icon-btn delete" title="Delete" onClick={()=>handleDelete(item._source, item.id)}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="no-data"><Package size={40} strokeWidth={1}/> <p>No logs found matching your criteria</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="pag-btn"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="pag-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                className={`pag-num ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="pag-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {modalType === 'view' && selectedItem && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content view-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Inquiry Details</h2><button className="close-x" onClick={closeModal}><X size={20}/></button></div>
            <div className="modal-body">
              <div className="detail-section"><div className="detail-main-info"><h3>{selectedItem.customer_name || selectedItem.name}</h3><p className="status-label">{getStatusIcon(selectedItem.status)}</p></div></div>
              <div className="details-grid">
                <div className="detail-item"><label><Phone size={12}/> Phone</label><span>{selectedItem.phone_number || selectedItem.phone || 'N/A'}</span></div>
                <div className="detail-item"><label><Package size={12}/> Interested In</label><span>{selectedItem.product_name || selectedItem.service || 'N/A'}</span></div>
                <div className="detail-item full-width"><label><Calendar size={12}/> Contacted On</label><span>{new Date(selectedItem.timestamp || selectedItem.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</span></div>
              </div>
              {(selectedItem.message || selectedItem.subject) && (<div className="message-full"><label><Info size={12}/> Inquiry Message</label><p>{selectedItem.message || selectedItem.subject}</p></div>)}
            </div>
            <div className="modal-footer"><button className="admin-btn secondary" onClick={closeModal}>Close</button></div>
          </div>
        </div>
      )}

      {modalType === 'edit' && selectedItem && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content edit-form" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Edit Client Data</h2><button className="close-x" onClick={closeModal}><X size={20}/></button></div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="edit-form-grid">
                  <div className="form-group"><label>Name</label><input name={selectedItem._source === 'whatsapp' ? 'customer_name' : 'name'} defaultValue={selectedItem.customer_name || selectedItem.name} required /></div>
                  <div className="form-group"><label>Phone Number</label><input name={selectedItem._source === 'whatsapp' ? 'phone_number' : 'phone'} defaultValue={selectedItem.phone_number || selectedItem.phone} required /></div>
                  <div className="form-group full-width"><label>Product / Service</label><input name={selectedItem._source === 'whatsapp' ? 'product_name' : 'service'} defaultValue={selectedItem.product_name || selectedItem.service} required /></div>
                  <div className="form-group full-width">
                    <label>Inquiry Message</label>
                    <textarea 
                      name="message" 
                      className="form-textarea" 
                      defaultValue={selectedItem.message || selectedItem.subject} 
                      placeholder="Add details about the customer's inquiry..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer"><button type="button" className="admin-btn secondary" onClick={closeModal}>Cancel</button><button type="submit" className="admin-btn primary">Save Changes</button></div>
            </form>
          </div>
        </div>
      )}

      {modalType === 'status' && selectedItem && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-status-modal" onClick={e => e.stopPropagation()}>
            <div className="status-modal-header"><h3>Quick Status Update</h3><button className="close-icon-btn" onClick={closeModal}><X size={18}/></button></div>
            <div className="status-modal-body">
              <p className="status-desc">Update the decision for <strong>{selectedItem.customer_name || selectedItem.name || 'Anonymous'}</strong></p>
              <div className="status-form-field">
                <label><span className="required">*</span> Order Decision?</label>
                <div className="select-box-custom">
                  <select defaultValue={selectedItem.status} id="status-select-input">
                    <option value="New">Keep as New</option>
                    <option value="Pending">Move to Pending</option>
                    <option value="Confirmed">Confirm Order</option>
                    <option value="Rejected">Reject Inquiry</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="status-modal-footer">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="apply-btn" onClick={() => {
                const val = document.getElementById('status-select-input').value;
                handleStatusUpdate(selectedItem._source, selectedItem.id, val);
              }}>Apply Change</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactLogs;
