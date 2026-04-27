import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    Info,
    Box,
    Image as ImageIcon
} from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './AddProduct.css';

const productSchema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    category: yup.string().required("Category is required"),
    subCategory: yup.string().required("Sub-category is required"),
    description: yup.string().min(20, "Description should be at least 20 characters").required(),
    material: yup.string().required("Material is required"),
    color: yup.string().required("Color is required"),
    dimensions: yup.string().required("Dimensions are required"),
    storage: yup.string().nullable(),
    in_stock: yup.boolean().default(true)
});

const AddProduct = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: { in_stock: true }
    });

    const [categories, setCategories] = useState([]);
    const [subCategoriesList, setSubCategoriesList] = useState([]);
    const [previews, setPreviews] = useState({ main: null, g1: null, g2: null, g3: null, g4: null });

    const selectedCategoryId = watch("category");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${SITE_CONTENT.api.base}/api/categories/`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            const cat = categories.find(c => c.id.toString() === selectedCategoryId);
            setSubCategoriesList(cat ? cat.subcategories : []);
        } else {
            setSubCategoriesList([]);
        }
    }, [selectedCategoryId, categories]);

    const handleImageChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [key]: url }));
            setValue(key, file);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (!['main', 'g1', 'g2', 'g3', 'g4'].includes(key)) {
                formData.append(key === 'subCategory' ? 'sub_category' : key, data[key]);
            }
        });

        if (data.main) formData.append('main_image', data.main);
        if (data.g1) formData.append('image2', data.g1);
        if (data.g2) formData.append('image3', data.g2);
        if (data.g3) formData.append('image4', data.g3);
        if (data.g4) formData.append('image5', data.g4);

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/products/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            });

            if (response.ok) {
                message.success("Product published to showroom!");
                reset();
                setPreviews({ main: null, g1: null, g2: null, g3: null, g4: null });
                navigate('/admin/products');
            } else {
                message.error("Creation failed. Please check inputs.");
            }
        } catch (error) {
            message.error("Network error.");
        }
    };

    return (
        <div className="track-orders-container add-product-page">
            <div className="track-header">
                <div>
                    <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)', textDecoration: 'none', fontSize: '12px', marginBottom: '12px', fontWeight: 800 }}>
                        <ArrowLeft size={14} /> BACK TO INVENTORY
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-grid-modern">
                {/* SECTION: BASIC INFO */}
                <div className="form-section">
                    <h3><Info size={16} style={{ marginRight: '8px' }} /> Basic Information</h3>
                </div>

                <div className="input-group full-width">
                    <label>Product Name <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                    <input {...register("name")} className={`modern-input ${errors.name ? 'error' : ''}`} placeholder="E.g. Heritage King Size Bed" />
                    {errors.name && <span className="error-msg">{errors.name.message}</span>}
                </div>

                <div className="input-group">
                    <label>Category <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                    <select {...register("category")} className="modern-input">
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="input-group">
                    <label>Sub-Category <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                    <select {...register("subCategory")} className="modern-input" disabled={!selectedCategoryId}>
                        <option value="">Select Sub-Category</option>
                        {subCategoriesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div className="input-group full-width">
                    <label>Description <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                    <textarea {...register("description")} className="modern-input" rows={5} placeholder="Describe the wood quality, design philosophy, and comfort..."></textarea>
                    {errors.description && <span className="error-msg">{errors.description.message}</span>}
                </div>

                {/* SECTION: SPECS */}
                <div className="form-section">
                    <h3><Box size={16} style={{ marginRight: '8px' }} /> Specifications</h3>
                </div>

                <div className="input-group">
                    <label>Material <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                    <input {...register("material")} className="modern-input" placeholder="E.g. A Grade Teakwood" />
                </div>

                <div className="input-group">
                    <label>Color/Finish <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                    <input {...register("color")} className="modern-input" placeholder="E.g. Walnut Finish" />
                </div>

                <div className="input-group">
                    <label>Dimensions <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                    <input {...register("dimensions")} className="modern-input" placeholder="E.g. 78L x 72W x 42H inches" />
                </div>

                <div className="input-group">
                    <label>Storage Details</label>
                    <input {...register("storage")} className="modern-input" placeholder="E.g. Box Storage with Hydraulic Lift" />
                </div>

                <div className="input-group full-width">
                    <label>Availability Status</label>
                    <select {...register("in_stock")} className="modern-input">
                        <option value={true}>In Stock (Ready to Order)</option>
                        <option value={false}>Out of Stock</option>
                    </select>
                </div>

                {/* SECTION: IMAGES */}
                <div className="form-section">
                    <h3><ImageIcon size={16} style={{ marginRight: '8px' }} /> Product Gallery</h3>
                </div>

                <div className="upload-modern-grid">
                    <label className="upload-box-main">
                        <input type="file" hidden accept=".webp" onChange={(e) => handleImageChange(e, 'main')} />
                        {previews.main ? (
                            <img src={previews.main} className="preview-img" alt="Main" />
                        ) : (
                            <div className="upload-inner">
                                <Upload size={32} />
                                <span>MAIN IMAGE</span>
                                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>.webp only</p>
                            </div>
                        )}
                    </label>

                    <div className="gallery-modern">
                        {['g1', 'g2', 'g3', 'g4'].map((key) => (
                            <label key={key} className="upload-box-small">
                                <input type="file" hidden accept=".webp" onChange={(e) => handleImageChange(e, key)} />
                                {previews[key] ? (
                                    <img src={previews[key]} className="preview-img" alt="Gallery" />
                                ) : (
                                    <ImageIcon size={20} color="#cbd5e1" />
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="submit-wrap-modern">
                    <button type="submit" className="btn-publish" disabled={isSubmitting}>
                        {isSubmitting ? 'UPLOADING...' : 'PUBLISH PRODUCT'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
