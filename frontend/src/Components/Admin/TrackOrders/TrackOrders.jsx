import React, { useState, useEffect } from 'react';
import { Table, Tabs, Tag, Button, Space, Modal, Form, Select, message } from 'antd';
import { ShoppingCartOutlined, CloseSquareOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../ContactLogs/ContactLogs.css';
import { SITE_CONTENT } from '../../../constants/content';

const { TabPane } = Tabs;

const TrackOrders = () => {
    // These would normally come from a global state or API
    // For now, using the sample data that was previously in ContactLogs
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const headers = { 'Authorization': `Token ${token}` };

            const [waRes, enqRes] = await Promise.all([
                fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/`, { headers }),
                fetch(`${SITE_CONTENT.api.base}/api/enquiries/`, { headers })
            ]);

            const allOrders = [];

            if (waRes.ok) {
                const waData = await waRes.json();
                waData.forEach(item => {
                    allOrders.push({
                        id: item.id,
                        source: 'wa',
                        name: item.customer_name || 'Anonymous (WhatsApp Click)',
                        phone: item.phone_number || 'N/A',
                        product: item.product_name,
                        order_confirm_status: item.is_order_confirmed ? 'Confirmed' : (item.status || 'Pending'),
                        order_status: item.order_status || 'Not Started',
                        created_at: new Date(item.timestamp),
                        message: `User clicked WhatsApp button for ${item.product_name}`
                    });
                });
            }
            if (enqRes.ok) {
                const enqData = await enqRes.json();
                enqData.forEach(item => {
                    allOrders.push({
                        ...item,
                        source: 'enq',
                        created_at: new Date(item.created_at),
                        order_confirm_status: item.is_order_confirmed ? 'Confirmed' : item.status
                    });
                });
            }

            setOrders(allOrders.sort((a, b) => b.created_at - a.created_at));
        } catch (error) {
            console.error("Fetch Error:", error);
            message.error("Failed to fetch orders.");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [form] = Form.useForm();

    const handleUpdateStatus = async (values) => {
        const isOrderConfirmed = values.order_confirm_status === 'Confirmed';

        try {
            const token = sessionStorage.getItem('token');
            const endpoint = selectedOrder.source === 'wa'
                ? `${SITE_CONTENT.api.base}/api/whatsapp-contacts/${selectedOrder.id}/`
                : `${SITE_CONTENT.api.base}/api/enquiries/${selectedOrder.id}/`;

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: values.order_confirm_status || selectedOrder.order_confirm_status,
                    is_order_confirmed: isOrderConfirmed,
                    order_status: values.order_status || selectedOrder.order_status
                })
            });

            if (response.ok) {
                message.success("Order status updated!");
                fetchOrders();
            } else {
                message.error("Failed to update status.");
            }
        } catch (error) {
            console.error(error);
            message.error("Could not update record.");
        }

        setIsStatusModalVisible(false);
        setSelectedOrder(null);
    };

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
                const status = record.order_confirm_status;
                return (
                    <Tag color={status === 'Confirmed' ? 'green' : 'red'}>
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
            render: (_, record) => (
                <div style={{ fontSize: '13px' }}>
                    <b>Intention:</b> {record.product || record.subject || record.service} <br />
                    <b>Message:</b> <span style={{ color: '#666' }}>{record.message}</span>
                </div>
            )
        }
    ];

    const confirmedOrders = orders.filter(o => o.order_confirm_status === 'Confirmed' && o.order_status !== 'Delivered');
    // const pendingOrders = orders.filter(o => o.order_confirm_status === 'Pending');
    const cancelledOrders = orders.filter(o => o.order_confirm_status === 'Rejected');
    const deliveredOrders = orders.filter(o => o.order_status === 'Delivered');

    const renderTable = (dataSource, countLabel, countValue, cardColor = '#c4953a') => (
        <div className="order-tab-content">
            <div className="order-stats-mini">
                <div className="stat-card" style={{ borderColor: cardColor, color: cardColor }}>{countLabel}: {countValue}</div>
            </div>
            <Table
                columns={orderColumns}
                dataSource={dataSource}
                rowKey="id"
                className="premium-table cursor-pointer"
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedOrder(record);
                        form.setFieldsValue({
                            order_confirm_status: record.order_confirm_status,
                            order_status: record.order_status
                        });
                        setIsStatusModalVisible(true);
                    }
                })}
            />
        </div>
    );

    return (
        <div className="contact-logs-page">
            <div className="logs-container">
                <header className="logs-header">
                    <Link to="/admin/products" className="back-link">
                        <ArrowLeftOutlined /> Back to Inventory
                    </Link>
                    <span className="header-label">Order Management System</span>
                    <h1 className="header-title">Track <em>Customer Orders</em></h1>
                </header>

                <Tabs defaultActiveKey="1" className="premium-tabs">
                    <TabPane
                        tab={<span><ShoppingCartOutlined /> Confirmed Orders</span>}
                        key="1"
                    >
                        {renderTable(confirmedOrders, "Active Orders", confirmedOrders.length)}
                    </TabPane>


                    <TabPane
                        tab={<span><CloseSquareOutlined /> Cancelled Orders</span>}
                        key="3"
                    >
                        {renderTable(cancelledOrders, "Cancelled Logs", cancelledOrders.length, '#ff4d4f')}
                    </TabPane>

                    <TabPane
                        tab={<span><CheckCircleOutlined /> Delivered Orders</span>}
                        key="4"
                    >
                        {renderTable(deliveredOrders, "Completed Orders", deliveredOrders.length, '#52c41a')}
                    </TabPane>
                </Tabs>
            </div>

            <Modal
                title="Update Order Status"
                open={isStatusModalVisible}
                onCancel={() => setIsStatusModalVisible(false)}
                footer={null}
                centered
                width={400}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateStatus}
                    onValuesChange={(changedValues, allValues) => {
                        if (changedValues.order_confirm_status) {
                            const decision = changedValues.order_confirm_status;
                            let newProgress = allValues.order_status;

                            if (decision === 'Confirmed') {
                                newProgress = 'Processing';
                            } else if (decision === 'Pending') {
                                newProgress = 'Not Started';
                            } else if (decision === 'Rejected') {
                                newProgress = 'Cancelled';
                            }

                            form.setFieldsValue({ order_status: newProgress });
                        }
                    }}
                >
                    <Form.Item name="order_confirm_status" label="Order Decision?">
                        <Select placeholder="Change status">
                            <Select.Option value="Confirmed">Confirmed</Select.Option>
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="Rejected">Rejected</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="order_status" label="Progress?">
                        <Select>
                            <Select.Option value="Not Started">Not Started</Select.Option>
                            <Select.Option value="Processing">In Production</Select.Option>
                            <Select.Option value="Delivered">Order Delivered</Select.Option>
                            <Select.Option value="Cancelled">Cancelled</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginTop: '20px', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsStatusModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Save Changes</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TrackOrders;
