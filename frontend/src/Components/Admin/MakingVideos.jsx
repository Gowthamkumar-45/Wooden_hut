import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Tag, Upload } from 'antd';
import { VideoCameraOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PlaySquareOutlined, UploadOutlined } from '@ant-design/icons';
import './ProductList.css'; // Reuse table patterns

const MakingVideos = () => {
    const initialVideos = [
        { id: 1, title: 'Teak Wood Furniture Making Process', url: 'https://www.youtube.com/watch?v=W-879sugOG8', thumbnail: 'https://img.youtube.com/vi/W-879sugOG8/hqdefault.jpg', date: '2026-04-01' },
        { id: 2, title: 'Teak Dining Set Polishing', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', date: '2026-03-25' }
    ];

    const [videos, setVideos] = useState(() => {
        const saved = localStorage.getItem('making_videos');
        return saved ? JSON.parse(saved) : initialVideos;
    });

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        localStorage.setItem('making_videos', JSON.stringify(videos));
    }, [videos]);

    const getYoutubeThumb = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const id = (match && match[2].length === 11) ? match[2] : null;
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1596708053450-474be618a901?w=400';
    };

    const handleAddOrEdit = (values) => {
        const thumb = getYoutubeThumb(values.url);
        if (editingVideo) {
            setVideos(prev => prev.map(v => v.id === editingVideo.id ? { ...v, ...values, thumbnail: thumb } : v));
            message.success("Video updated successfully!");
        } else {
            const newVideo = {
                id: Date.now(),
                ...values,
                date: new Date().toISOString().split('T')[0],
                thumbnail: thumb
            };
            setVideos([...videos, newVideo]);
            message.success("New making video added!");
        }
        setIsAddModalVisible(false);
        setEditingVideo(null);
        form.resetFields();
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete this video?',
            content: 'This will remove the video from the public "Making" section.',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                setVideos(videos.filter(v => v.id !== id));
                message.success("Video deleted.");
            }
        });
    };

    const columns = [
        {
            title: 'Preview',
            key: 'preview',
            width: 150,
            render: (_, record) => (
                <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={record.thumbnail} alt={record.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <PlaySquareOutlined style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '24px' }} />
                </div>
            )
        },
        {
            title: 'Video Details',
            key: 'details',
            render: (_, record) => (
                <div style={{ maxWidth: '300px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{record.title}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{record.description}</div>
                </div>
            )
        },
        {
            title: 'YouTube URL',
            dataIndex: 'url',
            key: 'url',
            render: (text) => <a href={text} target="_blank" rel="noreferrer" style={{ color: '#c4953a' }}>Watch Link</a>
        },
        {
            title: 'Posted On',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <Tag color="gold">{text}</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} size="small" onClick={() => {
                        setEditingVideo(record);
                        form.setFieldsValue(record);
                        setIsAddModalVisible(true);
                    }}>Edit</Button>
                    <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="contact-logs-page">
            <div className="logs-container">
                <header className="logs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="header-label">Media Management</span>
                        <h1 className="header-title">Making <em>Videos</em></h1>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large"
                        style={{ backgroundColor: '#c4953a', borderColor: '#c4953a' }}
                        onClick={() => {
                            setEditingVideo(null);
                            form.resetFields();
                            setIsAddModalVisible(true);
                        }}
                    >
                        Add New Video
                    </Button>
                </header>

                <div style={{ marginTop: '20px' }}>
                    <Table 
                        columns={columns} 
                        dataSource={videos} 
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        className="premium-table"
                    />
                </div>
            </div>

            <Modal
                title={editingVideo ? "Edit Making Video" : "Add New Making Video"}
                open={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
                centered
                width={500}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrEdit}>
                    <Form.Item name="title" label="Video Name" rules={[{ required: true, message: 'Please enter a name' }]}>
                        <Input placeholder="E.g. Table Making Process" />
                    </Form.Item>
                    
                    <Form.Item name="description" label="Video Description" rules={[{ required: true, message: 'Please describe the making process' }]}>
                        <Input.TextArea rows={3} placeholder="Tell about the craftsmanship..." />
                    </Form.Item>

                    <Form.Item name="url" label="Video Link (YouTube)" rules={[{ required: true, message: 'Please provide a YouTube URL' }]}>
                        <Input prefix={<PlaySquareOutlined />} placeholder="https://youtube.com/watch?v=..." />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginTop: '30px', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsAddModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#c4953a', borderColor: '#c4953a' }}>
                                {editingVideo ? "Save Updates" : "Publish Video"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MakingVideos;
