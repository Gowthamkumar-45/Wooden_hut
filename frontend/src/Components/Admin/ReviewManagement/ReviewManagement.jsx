import React, { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import { SITE_CONTENT } from '../../../constants/content';
import {
    CheckCircle,
    XCircle,
    Trash2,
    Eye,
    RefreshCw,
    Star,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './ReviewManagement.css';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };

            // Only add token if it exists and looks valid
            if (token && token !== 'undefined' && token !== 'null') {
                headers['Authorization'] = `Token ${token}`;
            }

            const response = await fetch(`${SITE_CONTENT.api.base}/api/reviews/`, { headers });

            if (response.status === 401) {
                // If token is invalid for this server, clear it and try again without auth
                console.warn("Invalid token for this server. Clearing session.");
                sessionStorage.removeItem('token');
                const publicRes = await fetch(`${SITE_CONTENT.api.base}/api/reviews/`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                if (publicRes.ok) {
                    const data = await publicRes.json();
                    setReviews(data);
                    return;
                }
            }

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                message.error("Failed to load reviews from server.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            message.error("Could not connect to the review service.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const handleToggleApproval = async (review) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/reviews/${review.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_approved: !review.is_approved })
            });

            if (response.ok) {
                message.success(review.is_approved ? "Review unapproved" : "Review approved successfully!");
                fetchAllReviews();
            } else {
                message.error("Update failed.");
            }
        } catch (error) {
            message.error("Could not update review status.");
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete Review?',
            content: 'Are you sure you want to permanently remove this review?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    await fetch(`${SITE_CONTENT.api.base}/api/reviews/${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    message.success("Review deleted.");
                    fetchAllReviews();
                } catch (error) {
                    message.error("Delete failed.");
                }
            }
        });
    };

    const showDetails = (review) => {
        Modal.info({
            title: `Customer Feedback Details`,
            width: 650,
            icon: null,
            content: (
                <div className="review-modal-content" style={{ paddingTop: '20px' }}>
                    <div className="modal-header-tag" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'var(--admin-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--admin-primary)' }}>
                            <Star size={24} fill="var(--admin-primary)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{review.name}</h3>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-light)' }}>{review.email}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
                        <div className="modal-row">
                            <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Product</strong>
                            <span style={{ fontWeight: 700 }}>{review.product_name}</span>
                        </div>
                        <div className="modal-row">
                            <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Rating</strong>
                            <div style={{ display: 'inline-flex', gap: '2px', color: '#f59e0b' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "none"} stroke={i < review.rating ? "none" : "#cbd5e1"} />
                                ))}
                            </div>
                        </div>
                        <div className="modal-row">
                            <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Submission Date</strong>
                            <span style={{ fontWeight: 700 }}>{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="modal-row">
                        <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>Customer Comment</strong>
                        <div style={{
                            fontStyle: 'italic',
                            background: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--admin-primary)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            lineHeight: '1.6',
                            color: '#334155'
                        }}>
                            "{review.review}"
                        </div>
                    </div>
                </div>
            ),
            okText: "Close Details",
            okButtonProps: { style: { background: 'var(--admin-primary)', borderRadius: '8px', height: '40px', padding: '0 24px' } }
        });
    };

    const getPaginatedReviews = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return reviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);

    if (loading) return <div className="admin-loading"><p>Syncing product reviews...</p></div>;

    return (
        <div className="track-orders-container review-mgmt-page">
            <div className="track-header">
                <button className="refresh-btn-main" onClick={fetchAllReviews} title="Refresh Updates">
                    <RefreshCw size={18} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>CUSTOMER</th>
                            <th>PRODUCT</th>
                            <th>RATING</th>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedReviews().length > 0 ? (
                            getPaginatedReviews().map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="cust-info">
                                            <span className="name">{item.name}</span>
                                            <span className="phone">{item.email}</span>
                                        </div>
                                    </td>
                                    <td><span className="req-text" style={{ fontSize: '11px', color: 'var(--admin-primary)', background: '#f5f3ff', padding: '4px 10px', borderRadius: '6px' }}>{item.product_name}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < item.rating ? "#f59e0b" : "none"} stroke={i < item.rating ? "none" : "#cbd5e1"} />
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${item.is_approved ? 'delivered' : 'processing'}`}>
                                            {item.is_approved ? 'APPROVED' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td><span className="order-meta"><span className="date">{new Date(item.created_at).toLocaleDateString()}</span></span></td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="icon-btn" title="View Details" onClick={() => showDetails(item)}><Eye size={16} /></button>
                                            <button
                                                className={`icon-btn toggle-btn ${item.is_approved ? 'unapprove-btn' : 'approve-btn'}`}
                                                onClick={() => handleToggleApproval(item)}
                                            >
                                                {item.is_approved ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                {item.is_approved ? 'Unapprove' : 'Approve'}
                                            </button>
                                            <button className="icon-btn delete" title="Delete Review" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="no-data"><Star size={40} strokeWidth={1} /> <p>No product reviews found</p></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
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
        </div>
    );
};

export default ReviewManagement;
