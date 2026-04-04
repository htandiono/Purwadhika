import React, { useState } from 'react';
import { userAction } from '../store';

export default function AuthModal() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (isLogin) {
            const success = userAction.login(email, password);
            if (!success) setError('Invalid email or password');
        } else {
            const success = userAction.register(name, email, password);
            if (!success) setError('Email already registered');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-todo-light-surface dark:bg-todo-dark-surface p-8 rounded-lg shadow-xl w-full max-w-md transition-colors mx-4">
                <h2 className="text-2xl font-bold text-center mb-6 text-todo-light-text dark:text-todo-dark-text tracking-wide">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow"
                        required
                    />
                    <button type="submit" className="bg-gradient-to-r from-[#AC2DEB] to-[#5596FF] text-white font-bold p-3 rounded-md mt-2 hover:opacity-90 transition-opacity">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[#AC2DEB] dark:text-[#A42395] hover:underline font-semibold ml-1">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
