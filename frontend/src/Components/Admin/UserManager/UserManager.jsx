import React, { useState, useEffect } from 'react';
import { message, Table, Popconfirm, Button, Modal, Input, Tag } from 'antd';
import { UserPlus, Trash2, KeyRound, ShieldCheck } from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './UserManager.css';

const BRANCH_OPTIONS = [
    { value: '', label: 'Super Admin (All Branches)' },
    { value: 'Coimbatore', label: 'Coimbatore Branch' },
    { value: 'Tanjavur', label: 'Tanjavur Branch' },
];

const getCurrentUser = () => {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}'); } catch { return {}; }
};

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', password: '', branch: '' });
    const [resetTarget, setResetTarget] = useState(null);
    const [resetPassword, setResetPassword] = useState('');

    const currentUser = getCurrentUser();
    const currentUsername = currentUser.username;

    const authHeaders = () => ({
        'Authorization': `Token ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${SITE_CONTENT.api.base}/api/users/`, { headers: authHeaders() });
            if (res.ok) setUsers(await res.json());
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    useEffect(() => {
        if (currentUser.is_superuser) fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.password.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`${SITE_CONTENT.api.base}/api/users/`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    branch: form.branch || null
                })
            });
            if (res.ok) {
                message.success('User created successfully!');
                setForm({ username: '', email: '', password: '', branch: '' });
                fetchUsers();
            } else {
                const err = await res.json().catch(() => ({}));
                const firstError = Object.values(err)[0];
                message.error(Array.isArray(firstError) ? firstError[0] : (firstError || 'Failed to create user.'));
            }
        } catch (err) {
            message.error('Network error.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${SITE_CONTENT.api.base}/api/users/${id}/`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (res.ok) {
                message.success('User removed.');
                fetchUsers();
            } else {
                const err = await res.json().catch(() => ({}));
                message.error(err.error || 'Failed to remove user.');
            }
        } catch (err) {
            message.error('Network error.');
        }
    };

    const handleResetPassword = async () => {
        if (!resetPassword || resetPassword.length < 6) {
            message.error('Password must be at least 6 characters.');
            return;
        }
        try {
            const res = await fetch(`${SITE_CONTENT.api.base}/api/users/${resetTarget.id}/reset-password/`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ password: resetPassword })
            });
            if (res.ok) {
                message.success(`Password updated for ${resetTarget.username}.`);
                setResetTarget(null);
                setResetPassword('');
            } else {
                message.error('Failed to reset password.');
            }
        } catch (err) {
            message.error('Network error.');
        }
    };

    const columns = [
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email', render: (v) => v || <span className="muted-cell">—</span> },
        {
            title: 'Access', dataIndex: 'branch', key: 'branch',
            render: (branch) => branch
                ? <Tag color="blue">{branch} Branch</Tag>
                : (
                    <Tag color="purple">
                        <span className="tag-icon-label">
                            <ShieldCheck size={12} />
                            Super Admin
                        </span>
                    </Tag>
                )
        },
        {
            title: 'Action', key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="small" icon={<KeyRound size={14} />} onClick={() => { setResetTarget(record); setResetPassword(''); }}>
                        Reset Password
                    </Button>
                    <Popconfirm
                        title="Remove this user?"
                        description={record.username === currentUsername ? "You can't delete your own account." : "This login will stop working immediately."}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        disabled={record.username === currentUsername}
                    >
                        <Button size="small" danger icon={<Trash2 size={14} />} disabled={record.username === currentUsername} />
                    </Popconfirm>
                </div>
            )
        }
    ];

    if (!currentUser.is_superuser) {
        return (
            <div className="user-manager-container">
                <div className="user-create-card">
                    <h3><ShieldCheck size={18} /> Access Restricted</h3>
                    <p className="user-form-note" style={{ margin: 0 }}>
                        Only Super Admin accounts can create or manage users. Your account doesn't have that access.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-manager-container">
            <div className="user-create-card">
                <h3><UserPlus size={18} /> Create New User</h3>
                <form onSubmit={handleCreate}>
                    <div className="user-form-grid">
                        <div className="input-group">
                            <label>Username <span className="required">*</span></label>
                            <input
                                type="text"
                                className="modern-input"
                                placeholder="E.g. coimbatore_admin"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="modern-input"
                                placeholder="E.g. branch@woodenhut.in"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Password <span className="required">*</span></label>
                            <input
                                type="password"
                                className="modern-input"
                                placeholder="At least 6 characters"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Access Level <span className="required">*</span></label>
                            <select
                                className="modern-input"
                                value={form.branch}
                                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                            >
                                {BRANCH_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="user-form-note">
                        A branch account (Coimbatore/Tanjavur) can only see and manage that branch's Track Orders and Customer Logs. Super Admin sees everything.
                    </p>
                    <button type="submit" className="btn-primary" disabled={loading || !form.username.trim() || !form.password.trim()}>
                        Create User
                    </button>
                </form>
            </div>

            <div className="user-list-card">
                <h3>Existing Users</h3>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: 'No users found.' }}
                    scroll={{ x: 'max-content' }}
                />
            </div>

            <Modal
                title={`Reset Password — ${resetTarget?.username || ''}`}
                open={!!resetTarget}
                onOk={handleResetPassword}
                onCancel={() => setResetTarget(null)}
                okText="Update Password"
            >
                <Input.Password
                    placeholder="New password (min 6 characters)"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    size="large"
                />
            </Modal>
        </div>
    );
};

export default UserManager;
