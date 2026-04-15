import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Tag, Upload } from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, 
    PlaySquareOutlined, UploadOutlined, FileImageOutlined 
} from '@ant-design/icons';
import '../ProductList/ProductList.css';

const API_BASE_URL = 'http://localhost:8000/api';

const MakingVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [form] = Form.useForm();
    const [thumbFileList, setThumbFileList] = useState([]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/making-videos/`);
            if (res.ok) {
                const data = await res.json();
                setVideos(data);
            }
        } catch (err) {
            message.error("Failed to load videos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleAddOrEdit = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('youtube_url', values.youtube_url || '');
        
        if (thumbFileList[0]?.originFileObj) {
            formData.append('thumbnail', thumbFileList[0].originFileObj);
        }

        const token = sessionStorage.getItem('token');
        const url = editingVideo 
            ? `${API_BASE_URL}/making-videos/${editingVideo.id}/` 
            : `${API_BASE_URL}/making-videos/`;
        
        const method = editingVideo ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            });

            if (res.ok) {
                message.success(`Video ${editingVideo ? 'updated' : 'published'} successfully!`);
                setIsAddModalVisible(false);
                setEditingVideo(null);
                setThumbFileList([]);
                form.resetFields();
                fetchVideos();
            } else {
                const errData = await res.json();
                if (errData.video_file) {
                    message.error(errData.video_file[0]);
                } else if (errData.youtube_url) {
                    message.error("Please enter a valid YouTube link.");
                } else if (errData.detail) {
                    message.error(errData.detail);
                } else {
                    message.error("Error saving video. Please check your inputs.");
                }
            }
        } catch (err) {
            message.error("Network error.");
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete this video?',
            content: 'This will permanently remove the video from storage.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                const token = sessionStorage.getItem('token');
                try {
                    const res = await fetch(`${API_BASE_URL}/making-videos/${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    if (res.ok) {
                        message.success("Video deleted.");
                        fetchVideos();
                    }
                } catch (err) {
                    message.error("Delete failed.");
                }
            }
        });
    };

    const columns = [
        {
            title: 'Preview',
            key: 'preview',
            width: 150,
            render: (_, record) => (
                <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                    {record.thumbnail ? (
                        <img src={record.thumbnail} alt={record.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <PlaySquareOutlined style={{ fontSize: '24px', color: '#ccc' }} />
                        </div>
                    )}
                    <PlaySquareOutlined style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '24px', opacity: 0.8 }} />
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
            title: 'Video Source',
            key: 'video_source',
            render: (_, record) => (
                record.youtube_url ? (
                    <a href={record.youtube_url} target="_blank" rel="noreferrer" style={{ color: '#ff0000', fontWeight: 600 }}>
                        <PlaySquareOutlined /> YouTube Link
                    </a>
                ) : (
                    <span style={{ color: '#999' }}>No Link Available</span>
                )
            )
        },
        {
            title: 'Posted On',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => <Tag color="purple">{new Date(text).toLocaleDateString()}</Tag>
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
        <div className="contact-logs-page" style={{ padding: '40px' }}>
            <div className="logs-container">
                <header className="logs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <span className="header-label" style={{ color: '#7c3aed', fontWeight: 600 }}>Media Production</span>
                        <h1 className="header-title" style={{ fontSize: '28px', margin: '4px 0' }}>Making <em>Videos</em></h1>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large"
                        style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed', height: '48px', borderRadius: '12px', fontWeight: 600 }}
                        onClick={() => {
                            setEditingVideo(null);
                            setThumbFileList([]);
                            form.resetFields();
                            setIsAddModalVisible(true);
                        }}
                    >
                        Upload New Video
                    </Button>
                </header>

                <Table 
                    columns={columns} 
                    dataSource={videos} 
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
            </div>

            <Modal
                title={editingVideo ? "Edit Video Details" : "Upload Furniture Making Video"}
                open={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
                centered
                width={500}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrEdit} style={{ marginTop: '20px' }}>
                    <Form.Item name="title" label="Video Title" rules={[{ required: true, message: 'Give your video a title' }]}>
                        <Input placeholder="E.g. Handcrafting our Teak Sofa" />
                    </Form.Item>
                    
                    <Form.Item name="description" label="Process Description" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} placeholder="Describe the crafting stages..." />
                    </Form.Item>

                    <Form.Item 
                        name="youtube_url" 
                        label="YouTube Video Link" 
                        extra="Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                        rules={[
                            { required: true, message: 'YouTube Link is required' },
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input prefix={<PlaySquareOutlined style={{ color: '#ff0000' }} />} placeholder="https://www.youtube.com/watch?v=..." />
                    </Form.Item>

                    <Form.Item label="Custom Thumbnail (Optional)" extra="If left blank, the site will use a default workshop image.">
                        <Upload 
                            listType="picture-card"
                            maxCount={1}
                            accept="image/*"
                            beforeUpload={() => false}
                            fileList={thumbFileList}
                            onChange={(info) => setThumbFileList(info.fileList)}
                        >
                            {thumbFileList.length < 1 && (
                                <div>
                                    <FileImageOutlined />
                                    <div style={{ marginTop: 8 }}>Thumbnail</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <div style={{ textAlign: 'right', marginTop: '32px' }}>
                        <Space size="large">
                            <Button onClick={() => setIsAddModalVisible(false)} style={{ border: 'none' }}>Cancel</Button>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed', borderRadius: '8px', padding: '0 24px', height: '40px' }}>
                                {editingVideo ? "Update Content" : "Start Upload"}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default MakingVideos;
