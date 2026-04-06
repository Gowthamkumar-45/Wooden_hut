import React, { useEffect, useState } from 'react';
import { Table, Tabs, message, Spin, Tag, Button, Space, Modal, Form, Input, Select, Switch } from 'antd';
import { WhatsAppOutlined, MailOutlined, EditOutlined, DeleteOutlined, UserOutlined, ShoppingCartOutlined, CheckCircleOutlined, CloseSquareOutlined } from '@ant-design/icons';
import { SITE_CONTENT } from '../../constants/content';
import './ContactLogs.css';

const { TabPane } = Tabs;

const ContactLogs = () => {
    // Static sample data as requested
    const sampleWhatsappLogs = [
        { id: 1, source: 'wa', name: "Gowtham Kumar (Truecaller)", phone: "+91 98765 43210", product: "King Size Teak Bed", timestamp: "2026-04-06 11:15 AM", query: "Interested in Queen size variant price", status: "Pending", is_order_confirmed: false, order_status: "Not Started", order_confirm_status: "Pending" },
        { id: 2, source: 'wa', name: "Priyan (Truecaller)", phone: "+91 91234 56789", product: "Royal Dining Table", timestamp: "2026-04-06 10:45 AM", query: "Asking for walnut finish availability", status: "Confirmed", is_order_confirmed: true, order_status: "Processing", order_confirm_status: "Confirmed" },
        { id: 3, source: 'wa', name: "Unknown", phone: "+91 88776 55443", product: "Rosewood Wardrobe", timestamp: "2026-04-06 09:30 AM", query: "Want to book a visiting appointment", status: "Cancelled", is_order_confirmed: false, order_status: "Not Started", order_confirm_status: "Cancelled" },
        { id: 4, source: 'wa', name: "Siddharth Palani (Truecaller)", phone: "+91 77665 44332", product: "Custom Sofa Set", timestamp: "2026-04-05 08:20 PM", query: "Enquiry about doorstep delivery to Madurai", status: "Pending", is_order_confirmed: false, order_status: "Not Started", order_confirm_status: "Pending" }
    ];

    const sampleEnquiries = [
        { id: 101, source: 'enq', name: "Rahul Varma", email: "rahul@example.com", phone: "9876543210", service: "Timber Supply", message: "I am interested in bulk ordering for my new home in Chennai.", created_at: "2026-04-01 10:00 AM", status: "Confirmed", is_order_confirmed: true, order_status: "Delivered", order_confirm_status: "Confirmed" },
        { id: 102, source: 'enq', name: "Sneha Das", email: "sneha@example.com", phone: "9123456789", service: "Custom Furniture", message: "Do you provide customization for the sofa colors? I want a dark velvet finish.", created_at: "2026-03-30 02:30 PM", status: "Pending", is_order_confirmed: false, order_status: "Not Started", order_confirm_status: "Pending" }
    ];

    const sampleGetInTouch = [
        { id: 201, source: 'git', name: "Meenakshi (Truecaller)", email: "meena@example.com", phone: "+91 99887 76655", subject: "Custom Sofa Requirement", message: "Want to discuss furniture for a five-room apartment. Please call.", created_at: "2026-04-06 09:00 AM", status: "Confirmed", is_order_confirmed: true, order_status: "Processing", order_confirm_status: "Confirmed" },
        { id: 202, source: 'git', name: "Anand R", email: "anand@example.com", phone: "+91 88776 65544", subject: "Wood Certificate Inquiry", message: "Interested in the sustainable wood source certificate.", created_at: "2026-04-05 06:15 PM", status: "Pending", is_order_confirmed: false, order_status: "Not Started", order_confirm_status: "Pending" }
    ];

    const [whatsappLogs, setWhatsappLogs] = useState(sampleWhatsappLogs);
    const [enquiries, setEnquiries] = useState(sampleEnquiries);
    const [getInTouch, setGetInTouch] = useState(sampleGetInTouch);
    const [loading, setLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isQuickModalVisible, setIsQuickModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [quickRecord, setQuickRecord] = useState(null);
    const [form] = Form.useForm();
    const [quickForm] = Form.useForm();

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            query: record.query || record.message,
            subject_or_service: record.subject || record.service,
            order_confirm_status: record.order_confirm_status || (record.status === 'Rejected' ? 'Cancelled' : record.status) || 'Pending',
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

    const handleUpdate = (values) => {
        const targetRecord = editingRecord || quickRecord;
        const updatedData = {
            ...values,
            message: values.query,
            is_order_confirmed: values.order_confirm_status === 'Confirmed',
            order_confirm_status: values.order_confirm_status,
            status: values.order_confirm_status // Mirror to status for existing filters
        };

        if (targetRecord.source === 'wa') {
            setWhatsappLogs(prev => prev.map(item => item.id === targetRecord.id ? { ...item, ...updatedData } : item));
        } else if (targetRecord.source === 'enq') {
            setEnquiries(prev => prev.map(item => item.id === targetRecord.id ? { ...item, ...updatedData } : item));
        } else if (targetRecord.source === 'git') {
            setGetInTouch(prev => prev.map(item => item.id === targetRecord.id ? { ...item, ...updatedData } : item));
        }

        message.success("Record moved successfully!");
        setIsEditModalVisible(false);
        setIsQuickModalVisible(false);
        setEditingRecord(null);
        setQuickRecord(null);
    };

    const handleDeleteWA = (id) => {
        Modal.confirm({
            title: 'Delete this contact log?',
            content: 'This will remove the entry from your view permanently.',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                setWhatsappLogs(whatsappLogs.filter(log => log.id !== id));
                message.success("Contact log removed.");
            }
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
                <Tag color={status === 'Confirmed' ? 'green' : status === 'Rejected' ? 'red' : 'gold'}>
                    {status || 'Pending'}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
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

    const handleDeleteEnquiry = (id) => {
        Modal.confirm({
            title: 'Delete this enquiry?',
            content: 'This will remove the customer message from your logs.',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                setEnquiries(enquiries.filter(e => e.id !== id));
                message.success("Enquiry removed.");
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
        },
        {
            title: 'Contacted On',
            dataIndex: 'created_at',
            key: 'time',
            render: (date) => <Tag color="blue">{date}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Confirmed' ? 'green' : status === 'Rejected' ? 'red' : 'gold'}>
                    {status || 'Pending'}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
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
                const status = record.order_confirm_status || (record.is_order_confirmed ? 'Confirmed' : (record.status === 'Rejected' ? 'Cancelled' : 'Pending'));
                return (
                    <Tag color={status === 'Confirmed' ? 'green' : status === 'Cancelled' ? 'red' : 'gold'}>
                        {status === 'Confirmed' && <CheckCircleOutlined />} {status.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Current Status',
            dataIndex: 'order_status',
            key: 'order_status',
            render: (status) => (
                <Tag color={status === 'Delivered' ? 'blue' : status === 'Processing' ? 'orange' : 'default'}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Requirement',
            key: 'req',
            width: '30%',
            render: (_, record) => (
                <div style={{ fontSize: '13px' }}>
                    <b>Intention:</b> {record.product || record.subject || record.service} <br />
                    <b>Message:</b> {record.query || record.message}
                </div>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Adjust Order</Button>
            )
        }
    ];

    // Filters for each tab
    const pendingFilter = (list) => list.filter(item => (!item.status || item.status === 'Pending') && (!item.order_confirm_status || item.order_confirm_status === 'Pending'));
    const confirmedList = [...whatsappLogs, ...enquiries, ...getInTouch].filter(item => item.order_confirm_status === 'Confirmed');
    const cancelledList = [...whatsappLogs, ...enquiries, ...getInTouch].filter(item => item.order_confirm_status === 'Cancelled' || item.status === 'Cancelled');

    if (loading) return <div className="detail-loader"><Spin size="large" /><span>Opening logs...</span></div>;

    return (
        <div className="contact-logs-page">
            <div className="logs-container">
                <header className="logs-header">
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
                            dataSource={pendingFilter(whatsappLogs)}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
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
                            dataSource={pendingFilter([...enquiries, ...getInTouch])}
                            rowKey={(record) => `${record.source}-${record.id}`}
                            pagination={{ pageSize: 10 }}
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
                            <Select.Option value="Confirmed">Confirmed</Select.Option>
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="Cancelled">Cancelled</Select.Option>
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
