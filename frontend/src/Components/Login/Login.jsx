import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { SITE_CONTENT } from '../../constants/content';
import './Login.css';

// ✅ Yup Schema for Login Form
const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
});

const Login = () => {
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
            remember: false
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${SITE_CONTENT.api.base}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password
                }),
            });

            const contentType = response.headers.get('content-type') || '';
            const result = contentType.includes('application/json')
                ? await response.json()
                : null;

            if (response.ok && result) {
                message.success("Successfully logged in!");
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('token', result.token);
                sessionStorage.setItem('user', JSON.stringify(result.user));

                setTimeout(() => {
                    window.location.href = '/';
                }, 500);
            } else if (response.status >= 500) {
                message.error("Server is unavailable. Please try again in a few minutes.");
            } else {
                message.error((result && result.error) || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            message.error("Unable to connect to service. Please try again later.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* LEFT SIDE: IMAGE SHOWCASE */}
                <div className="login-image-section">
                    <div className="login-image-content">
                        <h2 className="login-image-title">Welcome to <br /><em>{SITE_CONTENT.brand.name}</em></h2>
                        <p className="login-image-subtitle">Access your account to view your orders, saved items, and personalized recommendations for your home.</p>
                    </div>
                </div>

                {/* RIGHT SIDE: LOGIN FORM */}
                <div className="login-form-section">
                    <div className="login-header">
                        <h1 className="login-title">Sign In</h1>
                        <p className="login-subtitle">Please enter your details to continue</p>
                    </div>

                    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="login-form">
                        <Form.Item
                            label="Username"
                            validateStatus={errors.username ? "error" : ""}
                            help={errors.username?.message}
                        >
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter your username" size="large" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            validateStatus={errors.password ? "error" : ""}
                            help={errors.password?.message}
                        >
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input.Password {...field} placeholder="Enter your password" size="large" />
                                )}
                            />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <Controller
                                name="remember"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox {...field} checked={field.value}>Remember me</Checkbox>
                                )}
                            />
                            <span className="login-link" style={{ cursor: 'pointer' }}>Forgot Password?</span>
                        </div>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="login-submit-btn"
                                loading={isSubmitting}
                            >
                                SIGN IN
                            </Button>
                        </Form.Item>
                        
                        <div className="login-footer-links" style={{ justifyContent: 'center' }}>
                            <span>Don't have an account? <span className="login-link" style={{ marginLeft: '5px', cursor: 'pointer' }}>Sign Up</span></span>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
