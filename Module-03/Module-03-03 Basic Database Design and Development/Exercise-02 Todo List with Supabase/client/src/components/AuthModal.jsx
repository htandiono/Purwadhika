import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userAction } from '../store';

export default function AuthModal() {
    const [isLogin, setIsLogin] = useState(true);
    const [apiError, setApiError] = useState('');

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            ...(isLogin ? {} : { name: Yup.string().required('Name is required') }),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setApiError('');
            let success = false;
            
            if (isLogin) {
                success = await userAction.login(values.email, values.password);
                if (!success) setApiError('Invalid email or password');
            } else {
                success = await userAction.register(values.name, values.email, values.password);
                if (!success) setApiError('Registration failed or Email already exists');
            }
            setSubmitting(false);
        },
    });

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setApiError('');
        formik.resetForm();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-todo-light-surface dark:bg-todo-dark-surface p-8 rounded-lg shadow-xl w-full max-w-md transition-colors mx-4">
                <h2 className="text-2xl font-bold text-center mb-6 text-todo-light-text dark:text-todo-dark-text tracking-wide">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                {apiError && <p className="text-red-500 text-sm mb-4 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded">{apiError}</p>}
                
                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow ${formik.touched.name && formik.errors.name ? 'border border-red-500' : ''}`}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                            ) : null}
                        </div>
                    )}
                    
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow ${formik.touched.email && formik.errors.email ? 'border border-red-500' : ''}`}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow ${formik.touched.password && formik.errors.password ? 'border border-red-500' : ''}`}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <button 
                        type="submit" 
                        disabled={formik.isSubmitting}
                        className="bg-gradient-to-r from-[#AC2DEB] to-[#5596FF] text-white font-bold p-3 rounded-md mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {formik.isSubmitting ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={toggleMode} className="text-[#AC2DEB] dark:text-[#A42395] hover:underline font-semibold ml-1">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
