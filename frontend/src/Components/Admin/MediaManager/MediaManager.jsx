import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Tag, Tabs, Upload } from 'antd';
import { 
    VideoCameraOutlined, PlusOutlined, EditOutlined, 
    DeleteOutlined, PictureOutlined, PlaySquareOutlined, UploadOutlined 
} from '@ant-design/icons';
import '../ProductList/ProductList.css'; 

import { SITE_CONTENT } from '../../../constants/content';

const { TabPane } = Tabs;

const API_BASE_URL = `${SITE_CONTENT.api.base}/api`;

const MediaManager = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminMediaTab') || 'photo');
    const [editingItem, setEditingItem] = useState(null);

    const handleTabChange = (key) => {
        setActiveTab(key);
        localStorage.setItem('adminMediaTab', key);
    };
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/media-items/`);
            if (res.ok) {
                const data = await res.json();
                setMediaItems(data);
            }
        } catch (err) {
            message.error("Failed to load media assets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleSave = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description || '');
        formData.append('media_type', activeTab);
        
        if (fileList[0]?.originFileObj) {
            formData.append('file', fileList[0].originFileObj);
        } else if (!editingItem) {
            message.error("Please select a file to upload");
            return;
        }

        const token = sessionStorage.getItem('token');
        const url = editingItem 
            ? `${API_BASE_URL}/media-items/${editingItem.id}/` 
            : `${API_BASE_URL}/media-items/`;
        
        const method = editingItem ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            });

            if (res.ok) {
                message.success(`Media ${editingItem ? 'updated' : 'uploaded'} successfully!`);
                setIsModalVisible(false);
                setEditingItem(null);
                setFileList([]);
                form.resetFields();
                fetchMedia();
            } else {
                const errorData = await res.json();
                message.error(errorData.error || errorData.detail || "Error saving media item.");
            }
        } catch (err) {
            message.error("Network error.");
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete this asset?',
            content: 'This will remove the file permanently from storage.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                const token = sessionStorage.getItem('token');
                try {
                    const res = await fetch(`${API_BASE_URL}/media-items/${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    if (res.ok) {
                        message.success("Asset deleted.");
                        fetchMedia();
                    }
                } catch (err) {
                    message.error("Delete failed.");
                }
            }
        });
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
        const imgPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${imgPath}`;
    };

    const transformCloudinary = (url, transformations, mediaType, isPoster = false) => {
        if (!url || !url.includes('res.cloudinary.com')) return url;
        
        let newUrl = url;
        // 1. Force correct resource type based on media_type
        if (mediaType === 'video') {
            newUrl = newUrl.replace('/image/upload/', '/video/upload/');
        } else {
            newUrl = newUrl.replace('/video/upload/', '/image/upload/');
        }

        // 2. Insert transformations after /upload/
        newUrl = newUrl.replace('/upload/', `/upload/${transformations}/`);

        // 3. Handle extensions carefully (don't break on dates with dots)
        // Check for common media extensions
        const extMatch = /\.(mp4|webm|ogg|mov|webp|jpg|jpeg|png|gif|avif)$/i.test(newUrl);
        
        if (isPoster) {
            if (extMatch) {
                newUrl = newUrl.replace(/\.[^/.]+$/, '.jpg');
            } else {
                newUrl = `${newUrl}.jpg`;
            }
        } else if (!extMatch) {
            // Only append if it's clearly missing a known extension
            newUrl = `${newUrl}.${mediaType === 'video' ? 'mp4' : 'webp'}`;
        }
        
        return newUrl;
    };

    const getDisplayUrl = (record) => {
        let url = getImageUrl(record.file);
        if (!url) return 'https://via.placeholder.com/120x80?text=No+Media';

        if (record.media_type === 'video') {
            if (url.includes('res.cloudinary.com')) {
                return transformCloudinary(url, 'f_auto,q_auto,so_0,w_400,c_limit', 'video', true);
            }
            return 'https://via.placeholder.com/120x80?text=Video+Asset';
        }
        return url;
    };

    const getVideoPreviewUrl = (record) => {
        let url = getImageUrl(record.file);
        if (record.media_type === 'video' && url.includes('res.cloudinary.com')) {
            return transformCloudinary(url, 'e_preview:duration_5.0,f_auto,q_auto', 'video');
        }
        return url;
    };

    const columns = [
        {
            title: 'Preview',
            key: 'preview',
            width: 150,
            render: (_, record) => {
                const posterUrl = getDisplayUrl(record);
                const previewUrl = getVideoPreviewUrl(record);

                return (
                    <div className="product-thumb-container" style={{ width: '120px', height: '80px', position: 'relative', background: '#f8fafc', overflow: 'hidden', borderRadius: '8px', border: '1px solid #eee' }}>
                        {record.media_type === 'video' ? (
                            <video
                                key={previewUrl}
                                src={previewUrl}
                                poster={posterUrl}
                                muted
                                loop
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <img src={posterUrl} alt={record.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        {record.media_type === 'video' && (
                            <div style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px' }}>
                                <PlaySquareOutlined style={{ color: '#fff', fontSize: '14px' }} />
                            </div>
                        )}
                    </div>
                );
            }
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
            title: 'Asset Link',
            key: 'file',
            render: (_, record) => {
                const correctedUrl = transformCloudinary(getImageUrl(record.file), 'f_auto,q_auto', record.media_type);
                return <a href={correctedUrl} target="_blank" rel="noreferrer" style={{ color: '#7c3aed' }}>View Original File</a>
            }
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => <Tag color="gold">{new Date(text).toLocaleDateString()}</Tag>
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
                    <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            )
        }
    ];

    const photos = mediaItems.filter(item => item.media_type === 'photo');
    const videos = mediaItems.filter(item => item.media_type === 'video');

    return (
        <div className="contact-logs-page" style={{ padding: '40px' }}>
            <div className="logs-container">
                <header className="logs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <span className="header-label" style={{ color: '#7c3aed', fontWeight: 600 }}>Brand Assets</span>
                        <h1 className="header-title" style={{ fontSize: '28px', margin: '4px 0' }}>Media <em>Manager</em></h1>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large"
                        style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed', height: '48px', borderRadius: '12px', fontWeight: 600 }}
                        onClick={() => {
                            setEditingItem(null);
                            setFileList([]);
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Upload {activeTab === 'photo' ? 'Photo' : 'Video'}
                    </Button>
                </header>

                <Tabs activeKey={activeTab} className="premium-tabs" onChange={handleTabChange}>
                    <TabPane 
                        tab={<span><PictureOutlined /> Photos & Press</span>} 
                        key="photo"
                    >
                        <Table 
                            columns={columns} 
                            dataSource={photos} 
                            rowKey="id"
                            loading={loading}
                            className="premium-table"
                            style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}
                        />
                    </TabPane>
                    <TabPane 
                        tab={<span><VideoCameraOutlined /> Press Videos</span>} 
                        key="video"
                    >
                        <Table 
                            columns={columns} 
                            dataSource={videos} 
                            rowKey="id"
                            loading={loading}
                            className="premium-table"
                            style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}
                        />
                    </TabPane>
                </Tabs>
            </div>

            <Modal
                title={editingItem ? `Edit Asset Details` : `Upload New ${activeTab === 'photo' ? 'Photo' : 'Video'}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                width={500}
            >
                <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: '20px' }}>
                    <Form.Item name="title" label="Asset Title" rules={[{ required: true }]}>
                        <Input placeholder="Enter a descriptive title" />
                    </Form.Item>
                    
                    <Form.Item name="description" label="Short Description">
                        <Input.TextArea rows={3} placeholder="Add context or notes..." />
                    </Form.Item>

                    <Form.Item label={`Select ${activeTab === 'photo' ? 'Image' : 'Video'} File`} required={!editingItem}>
                        <Upload 
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={(info) => setFileList(info.fileList)}
                        >
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                    </Form.Item>

                    <div style={{ textAlign: 'right', marginTop: '32px' }}>
                        <Space size="large">
                            <Button onClick={() => setIsModalVisible(false)} style={{ border: 'none' }}>Cancel</Button>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed', padding: '0 24px', height: '40px', borderRadius: '8px' }}>
                                Start Upload
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default MediaManager;
