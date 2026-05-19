import React, { useState, useEffect } from 'react';
import { message, Collapse, List } from 'antd';
import { FolderPlus, Layers } from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './CategoryManager.css';

const { Panel } = Collapse;

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
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

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${SITE_CONTENT.api.base}/api/categories/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (response.ok) {
                message.success("Category added successfully!");
                setNewCategoryName('');
                fetchCategories();
            } else {
                message.error("Failed to add category.");
            }
        } catch (error) {
            message.error("Network error.");
        } finally {
            setLoading(false);
        }
    };

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
                message.error("Failed to add sub-category.");
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
                {/* Add Category Form */}
                <div className="form-card">
                    <h3><FolderPlus size={18} /> Add Main Category</h3>
                    <form onSubmit={handleAddCategory}>
                        <div className="input-group">
                            <label>Category Name <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="modern-input" 
                                placeholder="E.g. Living Room, Bedroom"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || !newCategoryName.trim()}>
                            Add Category
                        </button>
                    </form>
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
                            <Panel header={category.name} key={category.id}>
                                {category.subcategories && category.subcategories.length > 0 ? (
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={category.subcategories}
                                        renderItem={(sub) => <List.Item>{sub.name}</List.Item>}
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
