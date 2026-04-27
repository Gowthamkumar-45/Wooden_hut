import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Button, Select, Upload, message, Spin } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SITE_CONTENT } from '../../../constants/content';
import './EditProduct.css';

const { Option } = Select;

const productSchema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    category: yup.number().required("Category is required"),
    subCategory: yup.number().required("Sub-category is required"),
    description: yup.string().min(20, "Description should be at least 20 characters").required(),
    material: yup.string().required("Material is required"),
    color: yup.string().required("Color is required"),
    dimensions: yup.string().nullable(),
    storage: yup.string().required("Storage details are required"),
    in_stock: yup.boolean()
});

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [subCategoriesList, setSubCategoriesList] = useState([]);
    const [currentImages, setCurrentImages] = useState({});

    const { handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(productSchema)
    });

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
        const imgPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${imgPath}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await fetch(`${SITE_CONTENT.api.base}/api/categories/`);
                const catData = await catRes.json();
                setCategories(catData);

                const prodRes = await fetch(`${SITE_CONTENT.api.base}/api/products/${productId}/`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setCurrentImages({
                        main: getImageUrl(prodData.main_image),
                        image2: getImageUrl(prodData.image2),
                        image3: getImageUrl(prodData.image3),
                        image4: getImageUrl(prodData.image4),
                        image5: getImageUrl(prodData.image5)
                    });
                    reset({
                        name: prodData.name,
                        category: prodData.category,
                        subCategory: prodData.sub_category,
                        description: prodData.description,
                        material: prodData.material,
                        color: prodData.color,
                        dimensions: prodData.dimensions || '',
                        storage: prodData.storage || '',
                        in_stock: prodData.in_stock
                    });
                    const initialCat = catData.find(c => c.id === prodData.category);
                    setSubCategoriesList(initialCat ? initialCat.subcategories : []);
                }
            } catch (err) {
                message.error("Failed to load product data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId, reset]);

    const selectedCategoryId = watch("category");

    useEffect(() => {
        if (selectedCategoryId && categories.length > 0) {
            const cat = categories.find(c => c.id === selectedCategoryId);
            setSubCategoriesList(cat ? cat.subcategories : []);
        }
    }, [selectedCategoryId, categories]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category', data.category);
        formData.append('sub_category', data.subCategory);
        formData.append('description', data.description);
        formData.append('material', data.material);
        formData.append('color', data.color);
        if (data.dimensions) formData.append('dimensions', data.dimensions);
        formData.append('storage', data.storage);
        formData.append('in_stock', data.in_stock);

        if (data.mainImage?.fileList?.[0]) formData.append('main_image', data.mainImage.fileList[0].originFileObj);
        if (data.gallery1?.fileList?.[0]) formData.append('image2', data.gallery1.fileList[0].originFileObj);
        if (data.gallery2?.fileList?.[0]) formData.append('image3', data.gallery2.fileList[0].originFileObj);
        if (data.gallery3?.fileList?.[0]) formData.append('image4', data.gallery3.fileList[0].originFileObj);
        if (data.gallery4?.fileList?.[0]) formData.append('image5', data.gallery4.fileList[0].originFileObj);

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/products/${productId}/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            });

            if (response.ok) {
                message.success("Masterpiece updated successfully!");
                navigate('/admin/products');
            } else {
                message.error("Failed to update product.");
            }
        } catch (error) {
            message.error("Network error. Please try again.");
        }
    };

    if (loading) return <div className="detail-loader"><Spin size="large" /><span>Carving details...</span></div>;

    return (
        <div className="edit-product-page">
            <div className="edit-form-container">
                <header className="edit-form-header">
                    <Link to="/admin/products" className="edit-back-link">
                        <ArrowLeftOutlined /> Back to Inventory
                    </Link>
                    <span className="edit-header-label">Edit Masterpiece</span>
                    <h1 className="edit-header-title">Refine <em>Furniture</em></h1>
                </header>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="edit-premium-form-card">
                    <div className="edit-form-grid">
                        <Form.Item label="Product Name *" className="full-width" validateStatus={errors.name ? "error" : ""} help={errors.name?.message}>
                            <Controller name="name" control={control} render={({ field }) => <Input {...field} size="large" />} />
                        </Form.Item>

                        <Form.Item label="Category *" validateStatus={errors.category ? "error" : ""} help={errors.category?.message}>
                            <Controller name="category" control={control} render={({ field }) => (
                                <Select {...field} size="large" placeholder="Select Category">
                                    {categories.map(cat => (
                                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                    ))}
                                </Select>
                            )} />
                        </Form.Item>

                        <Form.Item label="Sub-Category *" validateStatus={errors.subCategory ? "error" : ""} help={errors.subCategory?.message}>
                            <Controller name="subCategory" control={control} render={({ field }) => (
                                <Select {...field} size="large" placeholder="Select Sub-Category">
                                    {subCategoriesList.map(sub => (
                                        <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                                    ))}
                                </Select>
                            )} />
                        </Form.Item>

                        <Form.Item label="Material *" validateStatus={errors.material ? "error" : ""} help={errors.material?.message}>
                            <Controller name="material" control={control} render={({ field }) => <Input {...field} size="large" />} />
                        </Form.Item>

                        <Form.Item label="Color/Finish *" validateStatus={errors.color ? "error" : ""} help={errors.color?.message}>
                            <Controller name="color" control={control} render={({ field }) => <Input {...field} size="large" />} />
                        </Form.Item>

                        <Form.Item label="Dimensions" validateStatus={errors.dimensions ? "error" : ""} help={errors.dimensions?.message}>
                            <Controller name="dimensions" control={control} render={({ field }) => <Input {...field} size="large" placeholder="E.g. 80 H X 35 W X 30 D" />} />
                        </Form.Item>

                        <Form.Item label="Storage *" validateStatus={errors.storage ? "error" : ""} help={errors.storage?.message}>
                            <Controller name="storage" control={control} render={({ field }) => <Input {...field} placeholder="E.g. Side drawers" size="large" />} />
                        </Form.Item>

                        <Form.Item label="Description *" validateStatus={errors.description ? "error" : ""} help={errors.description?.message} className="full-width">
                            <Controller name="description" control={control} render={({ field }) => <Input.TextArea {...field} rows={4} />} />
                        </Form.Item>

                        <Form.Item label="Inventory Status *" validateStatus={errors.in_stock ? "error" : ""} help={errors.in_stock?.message} className="full-width">
                            <Controller name="in_stock" control={control} render={({ field }) => (
                                <Select {...field} size="large">
                                    <Option value={true}>In Stock (Publicly Available)</Option>
                                    <Option value={false}>Out of Stock (Hidden/Badge)</Option>
                                </Select>
                            )} />
                        </Form.Item>

                        <div className="edit-imagery-section full-width">
                            <h3 className="edit-section-title">Product Imagery</h3>
                            <p className="edit-section-desc">Manage your masterpiece's visuals. Click on any image box to update it with a new file.</p>

                            <div className="edit-images-wrapper">
                                <div className="edit-image-row">
                                    <label className="edit-row-label">MAIN IMAGE</label>
                                    <Controller name="mainImage" control={control} render={({ field }) => (
                                        <Upload {...field} accept=".webp" listType="picture" maxCount={1} beforeUpload={() => false} onChange={(info) => field.onChange(info)} showUploadList={true} className="full-card-upload">
                                            <div className="edit-image-card-box clickable">
                                                <div className="edit-current-preview">
                                                    {currentImages.main ? (
                                                        <img src={currentImages.main} alt="Current" />
                                                    ) : (
                                                        <div className="no-image-placeholder">No Image</div>
                                                    )}
                                                </div>
                                                <div className="upload-hint">
                                                    <UploadOutlined />
                                                    <span>Click to Replace (.webp only)</span>
                                                </div>
                                            </div>
                                        </Upload>
                                    )} />
                                </div>

                                <div className="gallery-scroller">
                                    {[1, 2, 3, 4].map(idx => (
                                        <div key={idx} className="edit-image-row">
                                            <label className="edit-row-label">{`GALLERY IMAGE ${idx}`}</label>
                                            <Controller name={`gallery${idx}`} control={control} render={({ field }) => (
                                                <Upload {...field} accept=".webp" listType="picture" maxCount={1} beforeUpload={() => false} onChange={(info) => field.onChange(info)} showUploadList={true} className="full-card-upload">
                                                    <div className="edit-image-card-box clickable small-card">
                                                        <div className="edit-current-preview">
                                                            {currentImages[`image${idx + 1}`] ? (
                                                                <img src={currentImages[`image${idx + 1}`]} alt={`Gallery ${idx}`} />
                                                            ) : (
                                                                <div className="no-image-placeholder">Empty</div>
                                                            )}
                                                        </div>
                                                        <div className="upload-hint mini">
                                                            <UploadOutlined />
                                                            <span>.webp only</span>
                                                        </div>
                                                    </div>
                                                </Upload>
                                            )} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="edit-submit-bar">
                        <Button type="primary" htmlType="submit" size="large" className="edit-save-btn" loading={isSubmitting}>
                            SAVE CHANGES
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EditProduct;
