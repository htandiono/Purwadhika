import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header({ isDarkMode, toggleTheme }) {
    return (
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-[0.3em] text-white">
                TODO
            </h1>
            <button
                onClick={toggleTheme}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Toggle theme"
            >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
        </header>
    );
}
