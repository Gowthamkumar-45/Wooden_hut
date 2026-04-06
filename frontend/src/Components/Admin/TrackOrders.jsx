import React, { useState } from 'react';
import { Table, Tabs, Tag, Button, Space, Modal, Form, Select, message } from 'antd';
import { ShoppingCartOutlined, CloseSquareOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import './ContactLogs.css';

const { TabPane } = Tabs;

const TrackOrders = () => {
    // These would normally come from a global state or API
    // For now, using the sample data that was previously in ContactLogs
    const [orders, setOrders] = useState([
        { id: 2, source: 'wa', name: "Priyan (Truecaller)", phone: "+91 91234 56789", product: "Royal Dining Table", order_confirm_status: "Pending", order_status: "Not Started" },
        { id: 101, source: 'enq', name: "Rahul Varma", phone: "9876543210", service: "Timber Supply", order_confirm_status: "Confirmed", order_status: "Delivered" },
        { id: 201, source: 'git', name: "Meenakshi (Truecaller)", phone: "+91 99887 76655", subject: "Custom Sofa Requirement", order_confirm_status: "Confirmed", order_status: "Processing" },
        { id: 3, source: 'wa', name: "Unknown", phone: "+91 88776 55443", product: "Rosewood Wardrobe", order_confirm_status: "Cancelled", order_status: "Cancelled" }
    ]);

    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [form] = Form.useForm();

    const handleUpdateStatus = (values) => {
        setOrders(prev => prev.map(order => 
            order.id === selectedOrder.id ? { ...order, ...values } : order
        ));
        message.success("Order status updated!");
        setIsStatusModalVisible(false);
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
                    {record.product || record.subject || record.service}
                </div>
            )
        }
    ];

    const confirmedOrders = orders.filter(o => o.order_confirm_status === 'Confirmed' && o.order_status !== 'Delivered');
    const pendingOrders = orders.filter(o => o.order_confirm_status === 'Pending');
    const cancelledOrders = orders.filter(o => o.order_confirm_status === 'Cancelled');
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
                        tab={<span><EditOutlined /> Pending Orders</span>} 
                        key="2"
                    >
                        {renderTable(pendingOrders, "Pending/New", pendingOrders.length, '#faad14')}
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
                            } else if (decision === 'Cancelled') {
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
                            <Select.Option value="Cancelled">Cancelled</Select.Option>
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
