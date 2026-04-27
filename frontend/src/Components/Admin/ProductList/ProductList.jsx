import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, Tag, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, FilterOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { SITE_CONTENT } from '../../../constants/content';
import './ProductList.css';

const { Option } = Select;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [previewProduct, setPreviewProduct] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const headers = token ? { 'Authorization': `Token ${token}` } : {};
            const response = await fetch(`${SITE_CONTENT.api.base}/api/products/`, { headers });
            if (response.ok) {
                const data = await response.json();
                // Handle paginated or non-paginated product data
                setProducts(Array.isArray(data) ? data : (data.results || []));
            } else {
                message.error("Failed to fetch products. Status: " + response.status);
            }
        } catch (error) {
            message.error("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this masterpiece?',
            content: 'This action cannot be undone and will remove the product from the website.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await fetch(`${SITE_CONTENT.api.base}/api/products/${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    if (response.status === 204) {
                        message.success("Product removed from collection.");
                        fetchProducts();
                    }
                } catch (error) {
                    message.error("Delete failed. Please try again.");
                }
            }
        });
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
        if (path.startsWith('http')) return path;
        const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
        const imgPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${imgPath}`;
    };

    const subCategories = ['All', ...new Set(products.map(p => p.sub_category_name))];

    const columns = [
        {
            title: 'Image',
            dataIndex: 'main_image',
            key: 'image',
            render: (text) => (
                <img
                    src={getImageUrl(text)}
                    alt="product"
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                        if (e.target.src !== 'https://via.placeholder.com/50x50?text=No+Image') {
                            e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }
                    }}
                />
            )
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'category_name',
            key: 'category',
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Tag color="gold">{text}</Tag>
                    <small style={{ color: '#8c8c8c' }}>{record.sub_category_name}</small>
                </Space>
            )
        },
        {
            title: 'Material',
            dataIndex: 'material',
            key: 'material'
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        className="view-btn"
                        onClick={() => {
                            setPreviewProduct(record);
                            setIsPreviewVisible(true);
                        }}
                    >
                        View
                    </Button>
                    <Link to={`/admin/edit-product/${record.id}`}>
                        <Button icon={<EditOutlined />} size="small">Edit</Button>
                    </Link>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        },
    ];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesSubCat = selectedSubCategory === 'All' || p.sub_category_name === selectedSubCategory;
        return matchesSearch && matchesSubCat;
    });

    return (
        <div className="product-list-page">
            <div className="list-container">
                <header className="list-header">
                    <div className="header-info">
                        <span className="header-label">Inventory Overview</span>
                        <h1 className="header-title">Our <em>Masterpieces</em></h1>
                    </div>
                    <Link to="/admin/add-products">
                        <Button type="primary" icon={<PlusOutlined />} size="large" className="add-btn-premium">
                            ADD NEW PRODUCT
                        </Button>
                    </Link>
                </header>

                <div className="list-actions">
                    <div className="search-wrap">
                        <Input
                            placeholder="Search masterpieces..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="modern-input-search"
                            size="large"
                        />
                    </div>
                    <div className="filter-wrap">
                        <Select
                            defaultValue="All"
                            className="modern-select-filter"
                            style={{ width: 220 }}
                            size="large"
                            onChange={(val) => setSelectedSubCategory(val)}
                            suffixIcon={<FilterOutlined />}
                        >
                            {subCategories.map(sub => (
                                <Option key={sub} value={sub}>{sub}</Option>
                            ))}
                        </Select>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    className="premium-table"
                />

                <Modal
                    title={null}
                    open={isPreviewVisible}
                    onCancel={() => setIsPreviewVisible(false)}
                    footer={null}
                    width={500}
                    centered
                    className="product-preview-modal"
                >
                    {previewProduct && (
                        <div className="quick-preview-card">
                            <div className="preview-image-wrap">
                                <img src={getImageUrl(previewProduct.main_image)} alt={previewProduct.name} />
                                <div className={`preview-badge ${!previewProduct.in_stock ? 'out-of-stock' : ''}`}>
                                    {previewProduct.in_stock ? (previewProduct.sub_category_name || 'Premium') : 'Out of Stock'}
                                </div>
                            </div>
                            <div className="preview-content">
                                <span className="preview-mat">{previewProduct.material}</span>
                                <h2 className="preview-name">{previewProduct.name}</h2>
                                <p className="preview-desc">{previewProduct.description?.substring(0, 150)}...</p>
                                <div className="preview-footer">
                                    <Link to={`/product/${previewProduct.slug}`} onClick={() => setIsPreviewVisible(false)} className="full-page-btn">
                                        View Full Details <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default ProductList;
