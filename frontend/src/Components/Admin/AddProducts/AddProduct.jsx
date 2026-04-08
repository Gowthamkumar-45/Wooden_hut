import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { SITE_CONTENT } from '../../../constants/content';
import './AddProduct.css';

const { Option } = Select;

// const CATEGORY_MAPPING = {
//     living: ["Sofa Sets", "Pooja Unit", "Teapoy", "Storage Unit", "Swing", "TV Unit", "Chairs"],
//     dining: ["Dining Table Sets", "Dining Chairs", "Crockery Units", "Bar Cabinets"],
//     bedroom: ["King Size Beds", "Queen Size Beds", "Single Beds", "Cradle", "Wardrobes", "Dressing Tables", "Bedside Tables"],
//     office: ["Office Tables", "Office Chairs", "Bookshelves", "Office Storage Cabinets"],
//     "doors-and-windows": ["Doors", "Windows", "Nilai"]
// };

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
    const { handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: {
            category: undefined,
            subCategory: undefined,
            storage: '',
            in_stock: true
        }
    });

    const [categories, setCategories] = React.useState([]);
    const [subCategoriesList, setSubCategoriesList] = React.useState([]);

    React.useEffect(() => {
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

    const selectedCategoryId = watch("category");

    React.useEffect(() => {
        if (selectedCategoryId) {
            const cat = categories.find(c => c.id === selectedCategoryId);
            setSubCategoriesList(cat ? cat.subcategories : []);
            setValue("subCategory", undefined);
        } else {
            setSubCategoriesList([]);
        }
    }, [selectedCategoryId, categories, setValue]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category', data.category);
        formData.append('sub_category', data.subCategory);
        formData.append('description', data.description);
        formData.append('material', data.material);
        formData.append('color', data.color);
        formData.append('dimensions', data.dimensions);
        formData.append('storage', data.storage);
        formData.append('in_stock', data.in_stock);

        // Images handling (Ant Design Upload stores files in fileList)
        if (data.mainImage?.fileList?.[0]) formData.append('main_image', data.mainImage.fileList[0].originFileObj);
        if (data.gallery1?.fileList?.[0]) formData.append('image2', data.gallery1.fileList[0].originFileObj);
        if (data.gallery2?.fileList?.[0]) formData.append('image3', data.gallery2.fileList[0].originFileObj);
        if (data.gallery3?.fileList?.[0]) formData.append('image4', data.gallery3.fileList[0].originFileObj);
        if (data.gallery4?.fileList?.[0]) formData.append('image5', data.gallery4.fileList[0].originFileObj);

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/products/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            });

            if (response.ok) {
                message.success("Masterpiece added successfully!");
                reset({
                    name: '',
                    category: undefined,
                    subCategory: undefined,
                    description: '',
                    material: '',
                    color: '',
                    dimensions: '',
                    storage: '',
                    in_stock: true,
                    mainImage: { fileList: [] },
                    gallery1: { fileList: [] },
                    gallery2: { fileList: [] },
                    gallery3: { fileList: [] },
                    gallery4: { fileList: [] }
                });
            } else {
                const errData = await response.json();
                message.error(JSON.stringify(errData) || "Failed to add product.");
            }
        } catch (error) {
            message.error("Network error. Please try again.");
        }
    };

    return (
        <div className="add-product-page">
            <div className="form-container">
                <header className="form-header">
                    <Link to="/admin/products" className="back-link">
                        <ArrowLeftOutlined /> Back to Inventory
                    </Link>
                    <span className="header-label">Inventory Management</span>
                    <h1 className="header-title">Add New <em>Furniture</em></h1>
                    <p className="header-subtitle">Fill in the details below to list a new masterpiece in your collection.</p>
                </header>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="premium-form">
                    <div className="form-grid">
                        <Form.Item label="Product Name *" className="full-width" validateStatus={errors.name ? "error" : ""} help={errors.name?.message}>
                            <Controller name="name" control={control} render={({ field }) => <Input {...field} size="large" placeholder="E.g. Royal Teak Sofa" />} />
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
                                <Select {...field} size="large" placeholder="Select Sub-Category" disabled={!selectedCategoryId}>
                                    {subCategoriesList.map(sub => (
                                        <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                                    ))}
                                </Select>
                            )} />
                        </Form.Item>

                        <Form.Item label="Material *" validateStatus={errors.material ? "error" : ""} help={errors.material?.message}>
                            <Controller name="material" control={control} render={({ field }) => <Input {...field} size="large" placeholder="E.g. Solid Teak Wood" />} />
                        </Form.Item>

                        <Form.Item label="Color/Finish *" validateStatus={errors.color ? "error" : ""} help={errors.color?.message}>
                            <Controller name="color" control={control} render={({ field }) => <Input {...field} size="large" placeholder="E.g. Honey Oak" />} />
                        </Form.Item>

                        <Form.Item label="Dimensions" validateStatus={errors.dimensions ? "error" : ""} help={errors.dimensions?.message} className="full-width">
                            <Controller name="dimensions" control={control} render={({ field }) => <Input {...field} size="large" placeholder="E.g. 80 H X 35 W X 30 D inches" />} />
                        </Form.Item>

                        <Form.Item label="Storage *" validateStatus={errors.storage ? "error" : ""} help={errors.storage?.message} className="full-width">
                            <Controller name="storage" control={control} render={({ field }) => <Input {...field} size="large" placeholder="E.g. Under-bed storage, Side drawers, etc." />} />
                        </Form.Item>

                        <Form.Item label="Description *" validateStatus={errors.description ? "error" : ""} help={errors.description?.message} className="full-width">
                            <Controller name="description" control={control} render={({ field }) => <Input.TextArea {...field} rows={4} placeholder="Describe the craftsmanship and features..." />} />
                        </Form.Item>

                        <Form.Item label="Inventory Status *" validateStatus={errors.in_stock ? "error" : ""} help={errors.in_stock?.message} className="full-width">
                            <Controller name="in_stock" control={control} render={({ field }) => (
                                <Select {...field} size="large" placeholder="Select Status">
                                    <Option value={true}>In Stock (Available for Order)</Option>
                                    <Option value={false}>Out of Stock (Hidden Badge)</Option>
                                </Select>
                            )} />
                        </Form.Item>

                        <div className="image-upload-section full-width">
                            <h3 className="section-title">Product Imagery (Total 5)</h3>
                            <div className="upload-grid">
                                <Form.Item label="Main Feature Image" className="main-uploader">
                                    <Controller name="mainImage" control={control} render={({ field }) => (
                                        <Upload 
                                            listType="picture-card" 
                                            maxCount={1} 
                                            beforeUpload={() => false}
                                            fileList={field.value?.fileList || []}
                                            onChange={(info) => field.onChange(info)}
                                        >
                                            {(field.value?.fileList?.length || 0) >= 1 ? null : (
                                                <div><UploadOutlined /><div style={{ marginTop: 8 }}>Main Image</div></div>
                                            )}
                                        </Upload>
                                    )} />
                                </Form.Item>

                                <div className="gallery-uploaders">
                                    {[1, 2, 3, 4].map(idx => (
                                        <Form.Item key={idx}>
                                            <Controller name={`gallery${idx}`} control={control} render={({ field }) => (
                                                <Upload 
                                                    listType="picture-card" 
                                                    maxCount={1} 
                                                    beforeUpload={() => false}
                                                    fileList={field.value?.fileList || []}
                                                    onChange={(info) => field.onChange(info)}
                                                >
                                                    {(field.value?.fileList?.length || 0) >= 1 ? null : (
                                                        <div><UploadOutlined /></div>
                                                    )}
                                                </Upload>
                                            )} />
                                        </Form.Item>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Form.Item className="submit-section">
                        <Button type="primary" htmlType="submit" size="large" className="submit-product-btn" loading={isSubmitting}>
                            PUBLISH PRODUCT
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AddProduct;
