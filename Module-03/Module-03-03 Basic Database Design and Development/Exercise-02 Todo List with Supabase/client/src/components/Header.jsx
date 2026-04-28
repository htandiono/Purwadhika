import React, { useState } from 'react';
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from 'zustand';
import { appStore, userAction } from '../store';
import ProfileModal from './ProfileModal';

export default function Header() {
    const { isDarkMode, toggleTheme } = useTheme();
    const currentUserEmail = useStore(appStore, (state) => state.currentUserEmail);
    const currentUserName = useStore(appStore, (state) => state.currentUserName);
    
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    return (
        <>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-[0.3em] text-white">
                    TODO
                </h1>
                
                <div className="flex items-center gap-4 text-white">
                    {currentUserEmail && (
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-lg hidden sm:block">Hello, {currentUserName || 'User'}</span>
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="hover:text-todo-primary transition-colors flex items-center justify-center bg-white/10 p-2 rounded-full backdrop-blur-sm"
                                title="Edit Profile"
                            >
                                <UserIcon size={20} />
                            </button>
                            <button
                                onClick={userAction.logout}
                                className="hover:text-red-400 transition-colors flex items-center justify-center bg-white/10 p-2 rounded-full backdrop-blur-sm"
                                title="Log Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                    <div className="w-px h-6 bg-white/30 hidden sm:block"></div>
                    <button
                        onClick={toggleTheme}
                        className="hover:text-gray-200 transition-colors flex items-center justify-center bg-white/10 p-2 rounded-full backdrop-blur-sm"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            {isProfileModalOpen && (
                <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
            )}
        </>
    );
}
