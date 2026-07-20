import React, { useState, useEffect } from 'react';
import { message, Collapse, List, Popconfirm, Button, Tooltip } from 'antd';
import { Layers, Trash2, Lock } from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './CategoryManager.css';

const { Panel } = Collapse;

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        if (!newSubCategoryName.trim() || !selectedCategoryId) return;
        
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/subcategories/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ name: newSubCategoryName, category: selectedCategoryId })
            });

            if (response.ok) {
                message.success("Sub-Category added successfully!");
                setNewSubCategoryName('');
                setSelectedCategoryId('');
                fetchCategories();
            } else {
                try {
                    const errorData = await response.json();
                    if (errorData[0]) {
                        message.error(errorData[0]);
                    } else if (errorData.name) {
                        message.error(errorData.name[0]);
                    } else if (errorData.non_field_errors) {
                        message.error(errorData.non_field_errors[0]);
                    } else {
                        message.error("Failed to add sub-category.");
                    }
                } catch(e) {
                    message.error("Failed to add sub-category.");
                }
            }
        } catch (error) {
            message.error("Network error.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubCategory = async (id) => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/subcategories/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.ok) {
                message.success("Sub-Category deleted successfully!");
                fetchCategories();
            } else {
                message.error("Failed to delete sub-category.");
            }
        } catch (error) {
            message.error("Network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-manager-container">
            <div className="forms-grid">
                {/* Main categories are a fixed default set — not editable here */}
                <div className="form-card">
                    <h3><Lock size={18} /> Main Categories</h3>
                    <p className="category-note">
                        These {categories.length || 5} categories are fixed to match your website's menu. Add new product types as sub-categories instead.
                    </p>
                    <List
                        size="small"
                        bordered
                        dataSource={categories}
                        renderItem={(c) => (
                            <List.Item>
                                <Tooltip title="Fixed default category">
                                    <span className="locked-category-row">
                                        <Lock size={14} /> {c.name}
                                    </span>
                                </Tooltip>
                            </List.Item>
                        )}
                    />
                </div>

                {/* Add Sub Category Form */}
                <div className="form-card">
                    <h3><Layers size={18} /> Add Sub-Category</h3>
                    <form onSubmit={handleAddSubCategory}>
                        <div className="input-group">
                            <label>Parent Category <span className="required">*</span></label>
                            <select 
                                className="modern-input"
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Select a Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Sub-Category Name <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="modern-input" 
                                placeholder="E.g. Sofas, King Size Beds"
                                value={newSubCategoryName}
                                onChange={(e) => setNewSubCategoryName(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || !newSubCategoryName.trim() || !selectedCategoryId}>
                            Add Sub-Category
                        </button>
                    </form>
                </div>
            </div>

            <div className="existing-categories">
                <h3>Current Categories & Sub-Categories</h3>
                {categories.length === 0 ? (
                    <p className="no-data">No categories found. Please add some above.</p>
                ) : (
                    <Collapse accordion>
                        {categories.map(category => (
                            <Panel
                                header={category.name}
                                key={category.id}
                            >
                                {category.subcategories && category.subcategories.length > 0 ? (
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={category.subcategories}
                                        renderItem={(sub) => (
                                            <List.Item
                                                actions={[
                                                    <Popconfirm
                                                        placement="left"
                                                        title="Delete sub-category?"
                                                        description="All products under it will be deleted. Are you sure?"
                                                        onConfirm={() => handleDeleteSubCategory(sub.id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button type="text" danger size="small" icon={<Trash2 size={16} />} />
                                                    </Popconfirm>
                                                ]}
                                            >
                                                {sub.name}
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <p className="no-data-small">No sub-categories yet.</p>
                                )}
                            </Panel>
                        ))}
                    </Collapse>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
