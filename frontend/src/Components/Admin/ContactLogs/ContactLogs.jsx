import React, { useEffect, useState } from 'react';
import { Table, Tabs, message, Spin, Tag, Button, Space, Modal, Form, Input, Select } from 'antd';
import { WhatsAppOutlined, MailOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { SITE_CONTENT } from '../../../constants/content';
import './ContactLogs.css';

const { TabPane } = Tabs;

const ContactLogs = () => {

    const [whatsappLogs, setWhatsappLogs] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isQuickModalVisible, setIsQuickModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [quickRecord, setQuickRecord] = useState(null);
    const [form] = Form.useForm();
    const [quickForm] = Form.useForm();

    const fetchLogs = async (isInitial = false) => {
        if (isInitial) setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const headers = { 'Authorization': `Token ${token}` };

            const [waRes, enqRes] = await Promise.all([
                fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/`, { headers }),
                fetch(`${SITE_CONTENT.api.base}/api/enquiries/`, { headers })
            ]);

            if (waRes.ok) {
                const waData = await waRes.json();
                const formattedWa = waData.map(item => ({
                    id: item.id,
                    source: 'wa',
                    name: item.customer_name || 'Anonymous (WhatsApp Click)',
                    phone: item.phone_number || 'N/A',
                    product: item.product_name,
                    timestamp: new Date(item.timestamp).toLocaleString(),
                    query: `User clicked WhatsApp button for ${item.product_name}`,
                    status: item.status || 'New',
                    is_order_confirmed: item.is_order_confirmed,
                    order_status: item.order_status || 'Not Started',
                    order_confirm_status: item.is_order_confirmed ? 'Confirmed' : (item.status || 'New')
                }));
                // Sort by newest
                setWhatsappLogs(formattedWa.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            }
            if (enqRes.ok) {
                const enqData = await enqRes.json();
                const formattedEnq = enqData.map(item => ({
                    ...item,
                    source: 'enq',
                    created_at: new Date(item.created_at).toLocaleString(),
                    order_confirm_status: item.is_order_confirmed ? 'Confirmed' : item.status
                }));
                setEnquiries(formattedEnq.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            message.error("Failed to fetch logs.");
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(true);
    }, []);

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            query: record.query || record.message,
            subject_or_service: record.subject || record.service,
            order_confirm_status: record.order_confirm_status || (record.status === 'Rejected' ? 'Rejected' : record.status) || 'New',
            order_status: record.order_status || 'Not Started'
        });
        setIsEditModalVisible(true);
    };

    const handleQuickStatus = (record) => {
        setQuickRecord(record);
        quickForm.setFieldsValue({
            order_confirm_status: record.order_confirm_status || 'Pending'
        });
        setIsQuickModalVisible(true);
    };

    const handleUpdate = async (values) => {
        const targetRecord = editingRecord || quickRecord;
        const isOrderConfirmed = values.order_confirm_status === 'Confirmed';

        try {
            if (targetRecord.source === 'enq') {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`${SITE_CONTENT.api.base}/api/enquiries/${targetRecord.id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: values.order_confirm_status || targetRecord.status,
                        is_order_confirmed: isOrderConfirmed,
                        order_status: values.order_status || targetRecord.order_status
                    })
                });

                if (response.ok) {
                    message.success("Enquiry updated successfully!");
                    fetchLogs();
                } else {
                    message.error("Failed to update enquiry.");
                }
            } else if (targetRecord.source === 'wa') {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/${targetRecord.id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customer_name: values.name,
                        phone_number: values.phone,
                        status: values.order_confirm_status || targetRecord.status,
                        is_order_confirmed: isOrderConfirmed,
                        order_status: values.order_status || targetRecord.order_status
                    })
                });

                if (response.ok) {
                    message.success("Customer details updated successfully!");
                    fetchLogs();
                } else {
                    message.error("Failed to update WhatsApp contact.");
                }
            }

            setIsEditModalVisible(false);
            setIsQuickModalVisible(false);
            setEditingRecord(null);
            setQuickRecord(null);
        } catch (error) {
            console.error("Update Error:", error);
            message.error("Could not update record.");
        }
    };

    const handleDeleteWA = async (id) => {
        Modal.confirm({
            title: 'Delete this contact log?',
            content: 'This will remove the entry from your view permanently.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    await fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    message.success("Contact log removed.");
                    fetchLogs();
                } catch (error) {
                    message.error("Failed to delete log.");
                }
            }
        });
    };

    const showDetails = (record) => {
        Modal.info({
            title: 'Customer Lead Details',
            width: 500,
            icon: <EyeOutlined />,
            content: (
                <div style={{ marginTop: 20 }}>
                    <p style={{ marginBottom: 8 }}><b>Customer Name:</b> {record.name}</p>
                    <p style={{ marginBottom: 8 }}><b>Phone Number:</b> {record.phone}</p>
                    {record.source === 'enq' && <p style={{ marginBottom: 8 }}><b>Email:</b> {record.email}</p>}
                    <p style={{ marginBottom: 8 }}><b>{record.source === 'enq' ? 'Subject / Service' : 'Product'}:</b> {record.subject || record.service || record.product}</p>
                    <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 5, marginBottom: 8 }}>
                        <b>Message:</b> <br />
                        <span style={{ color: '#555' }}>{record.query || record.message}</span>
                    </div>
                    <p style={{ marginBottom: 8 }}><b>Contacted On:</b> <Tag>{record.timestamp || record.created_at}</Tag></p>
                </div>
            ),
            okText: 'Close',
        });
    };

    const waColumns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="customer-name-log">{text}</span>
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => <Tag color="green">{text}</Tag>
        },
        {
            title: 'Interested In',
            dataIndex: 'product',
            key: 'product',
            render: (text) => <span className="product-title-log">{text}</span>
        },
        {
            title: 'Query',
            dataIndex: 'query',
            key: 'query',
            render: (text) => <span className="query-text-log">"{text}"</span>
        },
        {
            title: 'Contacted On',
            dataIndex: 'timestamp',
            key: 'time',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Confirmed' ? 'green' : status === 'Rejected' ? 'red' : status === 'Pending' ? 'orange' : 'gold'}>
                    {status || 'New'}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 250,
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EyeOutlined />} size="small" onClick={() => showDetails(record)}>View</Button>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDeleteWA(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const handleDeleteEnquiry = async (id) => {
        Modal.confirm({
            title: 'Delete this enquiry?',
            content: 'This will remove the customer message from your logs.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    await fetch(`${SITE_CONTENT.api.base}/api/enquiries/${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    message.success("Enquiry removed.");
                    fetchLogs();
                } catch (error) {
                    message.error("Failed to delete enquiry.");
                }
            }
        });
    };

    const enqColumns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => <Tag color="green">{text}</Tag>
        },
        {
            title: 'Subject / Service',
            key: 'subject_service',
            render: (_, record) => (
                <Space direction="vertical" size="mini">
                    {record.subject && <Tag color="blue">{record.subject}</Tag>}
                    {record.service && <Tag color="gold">{record.service}</Tag>}
                </Space>
            )
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            ellipsis: true,
        },
        {
            title: 'Contacted On',
            dataIndex: 'created_at',
            key: 'time',
            width: 160,
            render: (date) => <Tag color="blue">{date}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={status === 'Confirmed' ? 'green' : status === 'Rejected' ? 'red' : status === 'Pending' ? 'orange' : 'gold'}>
                    {status || 'New'}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 250,
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EyeOutlined />} size="small" onClick={() => showDetails(record)}>View</Button>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDeleteEnquiry(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const orderColumns = [
        {
            title: 'Customer Details',
            key: 'customer',
            render: (_, record) => (
                <div className="order-customer-info">
                    <div style={{ fontWeight: 600 }}>{record.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
                </div>
            )
        },
        {
            title: 'Order Confirmation',
            key: 'confirmed',
            render: (_, record) => {
                const status = record.order_confirm_status || (record.is_order_confirmed ? 'Confirmed' : (record.status === 'Rejected' ? 'Rejected' : 'Pending'));
                return (
                    <Tag color={status === 'Confirmed' ? 'green' : status === 'Rejected' ? 'red' : 'gold'}>
                        {status === 'Confirmed' && <CheckCircleOutlined />} {status.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Requirement',
            key: 'req',
            width: '40%',
            render: (_, record) => (
                <div style={{ fontSize: '13px' }}>
                    <b>Intention:</b> {record.product || record.subject || record.service} <br />
                    <b>Message:</b> <span style={{ color: '#666' }}>{record.query || record.message}</span>
                </div>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Adjust Order</Button>
            )
        }
    ];

    // Filters for each tab
    const newFilter = (list) => list.filter(item => !item.status || item.status === 'New');
    const pendingList = [...whatsappLogs, ...enquiries].filter(item => item.status === 'Pending' || item.order_confirm_status === 'Pending');
    // const confirmedList = [...whatsappLogs, ...enquiries].filter(item => item.order_confirm_status === 'Confirmed');
    // const cancelledList = [...whatsappLogs, ...enquiries].filter(item => item.order_confirm_status === 'Rejected' || item.status === 'Rejected');

    if (loading) return <div className="detail-loader"><Spin size="large" /><span>Opening logs...</span></div>;

    return (
        <div className="contact-logs-page">
            <div className="logs-container">
                <header className="logs-header">
                    <Link to="/admin/products" className="back-link">
                        <ArrowLeftOutlined /> Back to Inventory
                    </Link>
                    <span className="header-label">Store Execution & Order Flow</span>
                    <h1 className="header-title">Orders & <em>Customer Leads</em></h1>
                </header>

                <Tabs defaultActiveKey="1" className="premium-tabs">
                    <TabPane
                        tab={<span><WhatsAppOutlined /> WhatsApp Contacts</span>}
                        key="1"
                    >
                        <Table
                            columns={waColumns.filter(c => c.key !== 'status')}
                            dataSource={newFilter(whatsappLogs)}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1000 }}
                            className="premium-table cursor-pointer"
                            onRow={(record) => ({
                                onClick: (e) => {
                                    // Don't trigger if clicking buttons
                                    if (e.target.closest('button')) return;
                                    handleQuickStatus(record);
                                }
                            })}
                        />
                    </TabPane>
                    <TabPane
                        tab={<span><MailOutlined /> Website Enquiries</span>}
                        key="2"
                    >
                        <Table
                            columns={enqColumns.filter(c => c.key !== 'status')}
                            dataSource={newFilter([...enquiries])}
                            rowKey={(record) => `${record.source}-${record.id}`}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1200 }}
                            className="premium-table cursor-pointer"
                            onRow={(record) => ({
                                onClick: (e) => {
                                    if (e.target.closest('button')) return;
                                    handleQuickStatus(record);
                                }
                            })}
                        />
                    </TabPane>
                    <TabPane
                        tab={<span><EditOutlined /> All Pending Orders</span>}
                        key="3"
                    >
                        <Table
                            columns={orderColumns}
                            dataSource={pendingList}
                            rowKey={(record) => `${record.source}-${record.id}`}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1000 }}
                            className="premium-table cursor-pointer"
                            onRow={(record) => ({
                                onClick: (e) => {
                                    if (e.target.closest('button')) return;
                                    handleQuickStatus(record);
                                }
                            })}
                        />
                    </TabPane>
                </Tabs>
            </div>

            <Modal
                title={editingRecord?.is_order_confirmed ? "Manage Active Order" : "Manage Customer Lead"}
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                centered
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                    className="manage-lead-form"
                >
                    <div className="form-section-title">Edit {editingRecord?.source === 'wa' ? 'WhatsApp' : 'Enquiry'} Details</div>

                    {/* Common Name/Phone */}
                    <Space size="large" style={{ width: '100%' }}>
                        <Form.Item name="name" label="Customer Name" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                    </Space>

                    {/* Source Specific Fields */}
                    {editingRecord?.source === 'wa' ? (
                        <>
                            <Form.Item name="product" label="Interested In">
                                <Input placeholder="E.g. King Size Teak Bed" />
                            </Form.Item>

                            <Form.Item name="query" label="Customer Query">
                                <Input.TextArea rows={3} placeholder="Customer message or discussion notes..." />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item name="email" label="Email Address">
                                <Input type="email" />
                            </Form.Item>

                            <Form.Item name="subject_or_service" label="Subject / Service">
                                <Input placeholder="Requirement type..." />
                            </Form.Item>

                            <Form.Item name="query" label="Message Details">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item style={{ textAlign: 'right', marginTop: '20px', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsEditModalVisible(false)}>Close</Button>
                            <Button type="primary" htmlType="submit">Save Changes</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Quick Status Update"
                open={isQuickModalVisible}
                onCancel={() => {
                    setIsQuickModalVisible(false);
                    setQuickRecord(null);
                }}
                footer={null}
                centered
                width={400}
            >
                <Form
                    form={quickForm}
                    layout="vertical"
                    onFinish={handleUpdate}
                >
                    <div style={{ marginBottom: '20px', color: '#666' }}>
                        Update the decision for <b>{quickRecord?.name}</b>
                    </div>
                    <Form.Item name="order_confirm_status" label="Order Decision?" rules={[{ required: true }]}>
                        <Select placeholder="Choose Status">
                            <Select.Option value="New">Keep as New</Select.Option>
                            <Select.Option value="Confirmed">Confirmed</Select.Option>
                            <Select.Option value="Pending">Move to Pending</Select.Option>
                            <Select.Option value="Rejected">Rejected</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginTop: '20px', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsQuickModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Apply Status</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ContactLogs;
