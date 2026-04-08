import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, Tag, Rate, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { SITE_CONTENT } from '../../../constants/content';
import './ReviewManagement.css';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            // Fetch all reviews (even unapproved ones)
            // Note: Admin should be authenticated for this to return all reviews 
            // if we follow the queryset logic in views.py
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/reviews/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                message.error("Failed to fetch reviews. Make sure you are logged in as admin.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            message.error("Something went wrong while fetching reviews.");
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
            title: `Review by ${review.name}`,
            width: 600,
            content: (
                <div className="review-modal-content">
                    <div className="modal-row"><strong>Product:</strong> {review.product_name}</div>
                    <div className="modal-row"><strong>Subject:</strong> {review.subject || 'N/A'}</div>
                    <div className="modal-row"><strong>Rating:</strong> <Rate disabled defaultValue={review.rating} /></div>
                    <div className="modal-row"><strong>Phone:</strong> {review.phone_number || 'N/A'}</div>
                    <div className="modal-row"><strong>Email:</strong> {review.email}</div>
                    <div className="modal-row" style={{ marginTop: '15px' }}>
                        <strong>Comment:</strong>
                        <p style={{ marginTop: '10px', fontStyle: 'italic', background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                            "{review.review}"
                        </p>
                    </div>
                </div>
            )
        });
    };

    const columns = [
        {
            title: 'Customer',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="cust-col">
                    <span className="cust-name">{text}</span>
                    <span className="cust-email">{record.email}</span>
                </div>
            )
        },
        {
            title: 'Product',
            dataIndex: 'product_name',
            key: 'product',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (val) => <Rate disabled defaultValue={val} style={{ fontSize: '14px' }} />
        },
        {
            title: 'Status',
            dataIndex: 'is_approved',
            key: 'status',
            render: (approved) => (
                approved ?
                    <Tag icon={<CheckCircleOutlined />} color="success">APPROVED</Tag> :
                    <Tag icon={<CloseCircleOutlined />} color="error">PENDING</Tag>
            )
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button icon={<EyeOutlined />} onClick={() => showDetails(record)} />
                    </Tooltip>
                    <Button
                        type={record.is_approved ? "default" : "primary"}
                        onClick={() => handleToggleApproval(record)}
                        style={!record.is_approved ? { background: '#52c41a', borderColor: '#52c41a' } : {}}
                    >
                        {record.is_approved ? "Unapprove" : "Approve"}
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <div className="review-mgmt-page">
            <div className="mgmt-container">
                <header className="mgmt-header">
                    <Link to="/admin/products" className="back-link">
                        <ArrowLeftOutlined /> Back to Inventory
                    </Link>
                    <div className="header-info">
                        <span className="header-label">Customer Feedback</span>
                        <h1 className="header-title">Review <em>Moderation</em></h1>
                    </div>
                    <Button type="primary" onClick={fetchAllReviews} className="refresh-btn">
                        Refresh List
                    </Button>
                </header>

                <Table
                    columns={columns}
                    dataSource={reviews}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="premium-table"
                />
            </div>
        </div>
    );
};

export default ReviewManagement;
