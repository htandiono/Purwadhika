import React, { useState } from 'react';
import { userAction } from '../store';
import { useStore } from 'zustand';
import { appStore } from '../store';

export default function ProfileModal({ onClose }) {
    const users = useStore(appStore, (state) => state.users);
    const currentUserEmail = useStore(appStore, (state) => state.currentUserEmail);
    const user = users.find(u => u.email === currentUserEmail);

    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState(user?.password || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        userAction.editUser(name, password);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-todo-light-surface dark:bg-todo-dark-surface p-8 rounded-lg shadow-xl w-full max-w-md transition-colors relative mx-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xl font-bold bg-todo-light-bg dark:bg-todo-dark-bg w-8 h-8 rounded-full flex items-center justify-center">
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 text-todo-light-text dark:text-todo-dark-text tracking-wide">
                    Edit Profile
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-semibold">Email (Cannot be changed)</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 p-3 rounded-md w-full cursor-not-allowed opacity-80"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-semibold">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-semibold">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-todo-light-bg dark:bg-todo-dark-bg text-todo-light-text dark:text-todo-dark-text p-3 rounded-md w-full outline-none focus:ring-2 focus:ring-todo-primary transition-shadow"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-gradient-to-r from-[#AC2DEB] to-[#5596FF] text-white font-bold p-3 rounded-md mt-4 hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
