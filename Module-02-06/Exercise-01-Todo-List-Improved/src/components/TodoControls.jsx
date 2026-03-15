import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export default function TodoControls({ searchQuery, setSearchQuery, sortOrder, setSortOrder }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* 
                Search Input 
                Binds directly to the App.jsx 'searchQuery' state. As the user types,
                the App's 'filteredTodos' hook reactively and strips out non-matching tasks.
            */}
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-todo-light-surface dark:bg-todo-dark-surface text-todo-light-text dark:text-todo-dark-text border-none shadow-[0_15px_30px_-5px_rgba(194,195,214,0.3)] dark:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-todo-primary focus:outline-none transition-colors duration-300"
                />
            </div>

            {/* 
                Sort Select Dropdown
                Binds to 'sortOrder' state. The App.jsx filteredTodos block runs an Array.sort()
                on the timestamps based on whether the user selects 'newest' or 'oldest'.
            */}
            <div className="relative min-w-[140px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <ArrowUpDown size={18} />
                </div>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 appearance-none rounded-md bg-todo-light-surface dark:bg-todo-dark-surface text-todo-light-text dark:text-todo-dark-text border-none shadow-[0_15px_30px_-5px_rgba(194,195,214,0.3)] dark:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-todo-primary focus:outline-none transition-colors duration-300 cursor-pointer"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
