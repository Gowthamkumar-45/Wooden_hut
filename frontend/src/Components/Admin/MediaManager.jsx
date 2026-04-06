import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Tag, Tabs, Upload } from 'antd';
import { CameraOutlined, VideoCameraOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined, PlaySquareOutlined, UploadOutlined } from '@ant-design/icons';
import './ProductList.css'; 

const { TabPane } = Tabs;

const MediaManager = () => {
    // Persistent state for photos and videos
    const [photos, setPhotos] = useState(() => {
        const saved = localStorage.getItem('admin_media_photos');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Grand Showroom Opening', type: 'photo', url: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=800', date: '2026-04-01', description: 'Celebrating our new flagship store opening.' }
        ];
    });

    const [videos, setVideos] = useState(() => {
        const saved = localStorage.getItem('admin_media_videos');
        return saved ? JSON.parse(saved) : [
            { id: 101, title: 'Showroom Walkthrough', type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', date: '2026-03-25', description: 'A quick tour of our teak furniture collection.' }
        ];
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('photo');
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        localStorage.setItem('admin_media_photos', JSON.stringify(photos));
    }, [photos]);

    useEffect(() => {
        localStorage.setItem('admin_media_videos', JSON.stringify(videos));
    }, [videos]);

    const getYoutubeThumb = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1596708053450-474be618a901?w=400';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const id = (match && match[2].length === 11) ? match[2] : null;
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1596708053450-474be618a901?w=400';
    };

    const handleSave = (values) => {
        const newItem = {
            id: editingItem ? editingItem.id : Date.now(),
            ...values,
            type: activeTab,
            date: editingItem ? editingItem.date : new Date().toISOString().split('T')[0]
        };

        if (activeTab === 'video') {
            newItem.thumbnail = getYoutubeThumb(values.url);
        }

        if (activeTab === 'photo') {
            if (editingItem) {
                setPhotos(prev => prev.map(p => p.id === editingItem.id ? newItem : p));
            } else {
                setPhotos([newItem, ...photos]);
            }
        } else {
            if (editingItem) {
                setVideos(prev => prev.map(v => v.id === editingItem.id ? newItem : v));
            } else {
                setVideos([newItem, ...videos]);
            }
        }

        message.success(`Media ${editingItem ? 'updated' : 'added'} successfully!`);
        setIsModalVisible(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleDelete = (id, type) => {
        Modal.confirm({
            title: 'Delete this media item?',
            content: 'This will remove it from the public media page.',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                if (type === 'photo') setPhotos(photos.filter(p => p.id !== id));
                else setVideos(videos.filter(v => v.id !== id));
                message.success("Item removed.");
            }
        });
    };

    const columns = [
        {
            title: 'Preview',
            key: 'preview',
            width: 150,
            render: (_, record) => (
                <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img src={record.type === 'video' ? record.thumbnail : record.url} alt={record.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {record.type === 'video' && <PlaySquareOutlined style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '24px' }} />}
                </div>
            )
        },
        {
            title: 'Media Details',
            key: 'details',
            render: (_, record) => (
                <div style={{ maxWidth: '350px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{record.title}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{record.description}</div>
                </div>
            )
        },
        {
            title: 'URL / Source',
            dataIndex: 'url',
            key: 'url',
            render: (text) => <a href={text} target="_blank" rel="noreferrer" style={{ color: '#c4953a' }}>{text.substring(0, 30)}...</a>
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <Tag color="gold">{text}</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} size="small" onClick={() => {
                        setEditingItem(record);
                        form.setFieldsValue(record);
                        setIsModalVisible(true);
                    }}>Edit</Button>
                    <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id, record.type)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="contact-logs-page">
            <div className="logs-container">
                <header className="logs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="header-label">Media & Press</span>
                        <h1 className="header-title">Media <em>Manager</em></h1>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large"
                        style={{ backgroundColor: '#c4953a', borderColor: '#c4953a' }}
                        onClick={() => {
                            setEditingItem(null);
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Add {activeTab === 'photo' ? 'Photo' : 'Video'}
                    </Button>
                </header>

                <Tabs defaultActiveKey="photo" className="premium-tabs" onChange={(key) => setActiveTab(key)}>
                    <TabPane 
                        tab={<span><PictureOutlined /> Photos & Press</span>} 
                        key="photo"
                    >
                        <Table 
                            columns={columns} 
                            dataSource={photos} 
                            rowKey="id"
                            className="premium-table"
                        />
                    </TabPane>
                    <TabPane 
                        tab={<span><VideoCameraOutlined /> Media Videos</span>} 
                        key="video"
                    >
                        <Table 
                            columns={columns} 
                            dataSource={videos} 
                            rowKey="id"
                            className="premium-table"
                        />
                    </TabPane>
                </Tabs>
            </div>

            <Modal
                title={editingItem ? `Edit ${activeTab === 'photo' ? 'Photo' : 'Video'}` : `Add New ${activeTab === 'photo' ? 'Photo' : 'Video'}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                width={500}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="title" label={`${activeTab === 'photo' ? 'Photo' : 'Video'} Title`} rules={[{ required: true }]}>
                        <Input placeholder="Enter title" />
                    </Form.Item>
                    
                    <Form.Item name="description" label="Short Description">
                        <Input.TextArea rows={3} placeholder="Describe this media item..." />
                    </Form.Item>

                    <Form.Item name="url" label={activeTab === 'photo' ? "Image URL" : "YouTube Video Link"} rules={[{ required: true }]}>
                        <Input prefix={activeTab === 'photo' ? <PictureOutlined /> : <PlaySquareOutlined />} placeholder={activeTab === 'photo' ? "https://..." : "https://youtube.com/watch?v=..."} />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginTop: '30px', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#c4953a', borderColor: '#c4953a' }}>
                                Save Media
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MediaManager;
